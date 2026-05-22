import { useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';
import { Text, Card } from '@playoff/ui';

export default function RoomScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View className="flex-1 bg-background px-4 pt-16">
      <Text variant="display" className="mb-2">
        Sala {id}
      </Text>
      <Text variant="caption" className="mb-8 text-muted-foreground">
        Realtime · Queue · Voting — Phase 5
      </Text>
      <Card glass>
        <Text variant="title">Stage background</Text>
        <Text variant="caption" className="mt-2">
          visual/effects/ambient — implementar
        </Text>
      </Card>
    </View>
  );
}
