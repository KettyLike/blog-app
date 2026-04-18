import Constants from 'expo-constants';
import { Platform } from 'react-native';

function resolveHostFromExpo() {
  const hostUri =
    Constants.expoConfig?.hostUri ??
    Constants.manifest2?.extra?.expoClient?.hostUri ??
    Constants.expoGoConfig?.debuggerHost ??
    Constants.manifest?.debuggerHost;

  if (!hostUri) {
    return null;
  }

  return hostUri.split(':')[0];
}

function resolveDefaultApiUrl() {
  if (Platform.OS === 'android') {
    const expoHost = resolveHostFromExpo();

    if (expoHost) {
      return `http://${expoHost}:4000`;
    }

    return 'http://10.0.2.2:4000';
  }

  return 'http://localhost:4000';
}

export const API_URL = process.env.EXPO_PUBLIC_API_URL ?? resolveDefaultApiUrl();
