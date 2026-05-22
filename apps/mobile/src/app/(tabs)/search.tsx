import { View } from 'react-native';
import { Text } from '@playoff/ui';

export default function SearchScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-background px-6">
      <Text variant="title">Busca</Text>
      <Text variant="caption" className="mt-2 text-center">
        Tracks · Playlists · Artists · Salas — Phase 7
      </Text>
    </View>
  );
}
