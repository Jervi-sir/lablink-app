import AsyncStorage from "@react-native-async-storage/async-storage";

const AS_TOKEN = "@auth_token";

export const setCachedAuthToken = async (token: string | null) => {
  if (token) await AsyncStorage.setItem(AS_TOKEN, token);
  else await AsyncStorage.removeItem(AS_TOKEN);
};

export const getStoredToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(AS_TOKEN);
  } catch {
    return null;
  }
};
