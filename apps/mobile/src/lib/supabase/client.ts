import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSupabaseClient, type PlayoffSupabase } from '@playoff/services';

let client: PlayoffSupabase | null = null;

export function getSupabase(): PlayoffSupabase {
  if (!client) {
    client = createSupabaseClient(AsyncStorage);
  }
  return client;
}
