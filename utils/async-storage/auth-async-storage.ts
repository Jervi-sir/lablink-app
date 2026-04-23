import AsyncStorage from "@react-native-async-storage/async-storage";

const AS_TOKEN = "@auth_token";
const AS_USER = "@auth_user";
const AS_STUDENT = "@auth_student";

export const setCachedAuthToken = async (token: string | null) => {
  if (token) await AsyncStorage.setItem(AS_TOKEN, token);
  else await AsyncStorage.removeItem(AS_TOKEN);
};

export const setCachedAuthData = async (user: any | null, student: any | null) => {
  if (user) await AsyncStorage.setItem(AS_USER, JSON.stringify(user));
  else await AsyncStorage.removeItem(AS_USER);

  if (student) await AsyncStorage.setItem(AS_STUDENT, JSON.stringify(student));
  else await AsyncStorage.removeItem(AS_STUDENT);
};

export const getStoredToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(AS_TOKEN);
  } catch {
    return null;
  }
};

export const getStoredAuthData = async (): Promise<{ user: any | null, student: any | null }> => {
  try {
    const user = await AsyncStorage.getItem(AS_USER);
    const student = await AsyncStorage.getItem(AS_STUDENT);
    return {
      user: user ? JSON.parse(user) : null,
      student: student ? JSON.parse(student) : null,
    };
  } catch {
    return { user: null, student: null };
  }
};
