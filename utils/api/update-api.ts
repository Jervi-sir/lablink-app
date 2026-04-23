import Constants from 'expo-constants';

import { Platform } from 'react-native';
import api from "./axios-instance";
import { ApiRoutes, buildRoute } from './api';

export type CheckUpdateResponse = {
  update_required: boolean;
  store_url: string | null;
  latest_version?: string;
  force_update?: boolean;
};

export const checkAppUpdate = async (): Promise<CheckUpdateResponse | null> => {
  try {
    const version =
      Constants.expoConfig?.version ?? Constants.manifest?.version ?? '1.0.0';

    // We send the version in the body or query params. 
    // Sending as POST is safer for future extensibility (e.g. platform, build number)
    const res = await api.post(buildRoute(ApiRoutes.app.checkUpdate), {
      version: version,
      platform: Platform.OS,
    });

    return res;
  } catch (error) {
    console.log('Check update error:', error);
    return null;
  }
};
