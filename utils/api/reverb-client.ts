import { BASE_URL } from "./api";
import axios from "axios";

type ReverbConfig = {
  host: string;
  port: number;
  key: string;
  scheme: 'ws' | 'wss';
};

export class ReverbClient {
  private ws: WebSocket | null = null;
  private socketId: string | null = null;
  private listeners: Map<string, ((data: any) => void)[]> = new Map();
  private channels: Set<string> = new Set();
  private authToken: string | null = null;

  constructor(private config: ReverbConfig) {}

  setAuthToken(token: string | null) {
    this.authToken = token;
  }

  connect() {
    const { host, port, key, scheme } = this.config;
    const url = `${scheme}://${host}:${port}/app/${key}?protocol=7&client=js&version=8.4.0-rc2&flash=false`;
    
    this.ws = new WebSocket(url);

    this.ws.onopen = () => {
      console.log("[Reverb] Connected");
    };

    this.ws.onmessage = (e) => {
      const payload = JSON.parse(e.data);
      console.log("[Reverb] Message:", payload);

      if (payload.event === "pusher:connection_established") {
        const data = JSON.parse(payload.data);
        this.socketId = data.socket_id;
        console.log("[Reverb] Socket ID:", this.socketId);
        // Re-subscribe to channels if any
        this.channels.forEach(channel => this.subscribe(channel));
      } else if (payload.event === "pusher:error") {
        console.error("[Reverb] Error:", payload.data);
      } else if (payload.event === "pusher_internal:subscription_succeeded") {
        console.log(`[Reverb] Subscribed to ${payload.channel}`);
      } else {
        // Custom events
        const eventListeners = this.listeners.get(`${payload.channel}:${payload.event}`);
        if (eventListeners) {
          const data = typeof payload.data === 'string' ? JSON.parse(payload.data) : payload.data;
          eventListeners.forEach(cb => cb(data));
        }
      }
    };

    this.ws.onerror = (e) => {
      console.error("[Reverb] WebSocket Error:", e);
    };

    this.ws.onclose = () => {
      console.log("[Reverb] Disconnected");
      this.ws = null;
      this.socketId = null;
    };
  }

  async subscribe(channel: string) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN || !this.socketId) {
      this.channels.add(channel);
      return;
    }

    let auth = null;
    if (channel.startsWith('private-') || channel.startsWith('presence-')) {
      if (!this.authToken) return;
      
      try {
        const response = await axios.post(`${BASE_URL}broadcasting/auth`, {
          socket_id: this.socketId,
          channel_name: channel
        }, {
          headers: {
            Authorization: `Bearer ${this.authToken}`
          }
        });
        auth = response.data.auth;
      } catch (error) {
        console.error(`[Reverb] Auth failed for ${channel}:`, error);
        return;
      }
    }

    this.ws.send(JSON.stringify({
      event: "pusher:subscribe",
      data: {
        channel,
        auth
      }
    }));
    this.channels.add(channel);
  }

  unsubscribe(channel: string) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        event: "pusher:unsubscribe",
        data: { channel }
      }));
    }
    this.channels.delete(channel);
  }

  on(channel: string, event: string, callback: (data: any) => void) {
    const key = `${channel}:${event}`;
    if (!this.listeners.has(key)) {
      this.listeners.set(key, []);
    }
    this.listeners.get(key)!.push(callback);
  }

  off(channel: string, event: string, callback: (data: any) => void) {
    const key = `${channel}:${event}`;
    const eventListeners = this.listeners.get(key);
    if (eventListeners) {
      this.listeners.set(key, eventListeners.filter(cb => cb !== callback));
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
    }
  }
}
