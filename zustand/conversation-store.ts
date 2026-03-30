import { create } from 'zustand';
import api from '@/utils/api/axios-instance';
import { buildRoute } from '@/utils/api/api';
import { ApiRoutes } from '@/utils/api/api';
import { ReverbClient } from '@/utils/api/reverb-client';
import { SERVER_IP } from '@/utils/api/api';
import { useAuthStore } from './auth-store';

type Message = {
  id: number;
  conversation_id: number;
  sender_id: number;
  message: string;
  type: 'text' | 'image';
  object: any;
  is_read: boolean;
  created_at: string;
  sender?: any;
};

type Conversation = {
  id: number;
  user1_id: number;
  user2_id: number;
  updated_at: string;
  user1: any;
  user2: any;
  messages: Message[];
  unread_count?: number;
};

type ConversationStore = {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  isLoading: boolean;
  isSending: boolean;
  reverb: ReverbClient | null;

  fetchConversations: (query?: string) => Promise<void>;
  fetchConversationDetails: (id: number) => Promise<void>;
  setActiveConversation: (conversation: Conversation | null) => void;
  sendMessage: (id: number, content: string, image?: any) => Promise<void>;
  createConversation: (targetUserId: number) => Promise<Conversation>;
  deleteConversation: (id: number) => Promise<void>;
  deleteMessage: (conversationId: number, messageId: number) => Promise<void>;
  
  initReverb: () => void;
  cleanup: () => void;
  
  addMessageToActive: (message: Message) => void;
  updateConversationLastMessage: (message: Message) => void;
};

export const useConversationStore = create<ConversationStore>((set, get) => ({
  conversations: [],
  activeConversation: null,
  isLoading: false,
  isSending: false,
  reverb: null,

  fetchConversations: async (query = '') => {
    set({ isLoading: true });
    try {
      const response: any = await api.get(ApiRoutes.conversations.index, { params: { q: query } });
      set({ conversations: response.data, isLoading: false });
    } catch (error) {
      console.error("Fetch conversations error:", error);
      set({ isLoading: false });
    }
  },

  fetchConversationDetails: async (id) => {
    set({ isLoading: true });
    try {
      const response: any = await api.get(buildRoute(ApiRoutes.conversations.show, { id }));
      set({ activeConversation: response.data, isLoading: false });
      
      // Subscribe to this conversation channel
      const reverb = get().reverb;
      if (reverb) {
        reverb.subscribe(`private-conversation.${id}`);
      }
    } catch (error) {
      console.error("Fetch conversation details error:", error);
      set({ isLoading: false });
    }
  },

  setActiveConversation: (conversation) => {
    const prev = get().activeConversation;
    const reverb = get().reverb;
    if (prev && reverb) {
        reverb.unsubscribe(`private-conversation.${prev.id}`);
    }

    set({ activeConversation: conversation });
    
    if (conversation && reverb) {
        reverb.subscribe(`private-conversation.${conversation.id}`);
    }
  },

  sendMessage: async (id, content, image = null) => {
    set({ isSending: true });
    try {
      const formData = new FormData();
      if (content) formData.append('message', content);
      if (image) {
        formData.append('image', {
          uri: image.uri,
          name: image.fileName || 'image.jpg',
          type: image.mimeType || 'image/jpeg',
        } as any);
      }
      formData.append('type', image ? 'image' : 'text');

      const response: any = await api.post(
        buildRoute(ApiRoutes.conversations.sendMessage, { id }),
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      );
      
      const newMessage = response.data;
      get().addMessageToActive(newMessage);
      get().updateConversationLastMessage(newMessage);
      set({ isSending: false });
    } catch (error) {
      console.error("Send message error:", error);
      set({ isSending: false });
    }
  },

  createConversation: async (targetUserId) => {
    try {
      const response: any = await api.post(ApiRoutes.conversations.store, { target_user_id: targetUserId });
      const conversation = response.data;
      // Refresh list
      get().fetchConversations();
      return conversation;
    } catch (error) {
      console.error("Create conversation error:", error);
      throw error;
    }
  },

  deleteConversation: async (id) => {
    try {
      await api.delete(buildRoute(ApiRoutes.conversations.show, { id }));
      set({ 
        conversations: get().conversations.filter(c => c.id !== id),
        activeConversation: get().activeConversation?.id === id ? null : get().activeConversation
      });
    } catch (error) {
      console.error("Delete conversation error:", error);
    }
  },

  deleteMessage: async (conversationId, messageId) => {
    try {
      await api.delete(`${buildRoute(ApiRoutes.conversations.show, { id: conversationId })}/messages/${messageId}`);
      if (get().activeConversation?.id === conversationId) {
        set({
          activeConversation: {
            ...get().activeConversation!,
            messages: get().activeConversation!.messages.filter(m => m.id !== messageId)
          }
        });
      }
    } catch (error) {
       console.error("Delete message error:", error);
    }
  },

  initReverb: () => {
    const authStore = useAuthStore.getState();
    if (!authStore.authToken || !authStore.auth) return;

    if (get().reverb) return;

    // Use environment variables or defaults
    const reverb = new ReverbClient({
      host: SERVER_IP,
      port: 8080,
      key: 'on17t5yzhx1cpuiootat',
      scheme: 'ws'
    });

    reverb.setAuthToken(authStore.authToken);
    reverb.connect();

    // Global user channel for new conversations/messages
    reverb.subscribe(`private-user.${authStore.auth.id}`);
    reverb.on(`private-user.${authStore.auth.id}`, 'message.sent', (data) => {
       console.log("New message received via user channel:", data);
       get().updateConversationLastMessage(data);
       if (get().activeConversation?.id === data.conversation_id) {
           get().addMessageToActive(data);
       }
    });

    set({ reverb });
  },

  cleanup: () => {
    const reverb = get().reverb;
    if (reverb) {
      reverb.disconnect();
      set({ reverb: null });
    }
  },

  addMessageToActive: (message) => {
    const active = get().activeConversation;
    if (active && active.id === message.conversation_id) {
      // Check if message already exists
      if (active.messages.find(m => m.id === message.id)) return;

      set({
        activeConversation: {
          ...active,
          messages: [...active.messages, message]
        }
      });
    }
  },

  updateConversationLastMessage: (message) => {
    const { conversations } = get();
    const index = conversations.findIndex(c => c.id === message.conversation_id);
    
    if (index !== -1) {
      const updatedConversations = [...conversations];
      updatedConversations[index] = {
        ...updatedConversations[index],
        messages: [message], // We only keep the last one in the list view
        updated_at: message.created_at
      };
      // Sort by updated_at
      updatedConversations.sort((a,b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
      set({ conversations: updatedConversations });
    } else {
      // Refresh list if it's a new conversation
      get().fetchConversations();
    }
  }
}));
