import { ScrollView } from 'react-native';
import { Text, Card } from '@playoff/ui';

export default function HomeScreen() {
  return (
    <ScrollView className="flex-1 bg-background px-4 pt-16" contentContainerClassName="pb-32">
      <Text variant="display" className="mb-2">
        Playoff
      </Text>
      <Text variant="body" className="mb-8 text-muted-foreground">
        Salas colaborativas · Player imersivo · Realtime
      </Text>
      <Card glass className="mb-4">
        <Text variant="title">Recently played</Text>
        <Text variant="caption" className="mt-2">
          Phase 2 — Home feed
        </Text>
      </Card>
      <Card>
        <Text variant="title">Room invitations</Text>
        <Text variant="caption" className="mt-2">
          Phase 5 — Rooms
        </Text>
      </Card>
    </ScrollView>
  );
}
