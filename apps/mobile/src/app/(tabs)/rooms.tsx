import { View } from 'react-native';
import { Text, Button } from '@playoff/ui';
import { Link } from 'expo-router';

export default function RoomsScreen() {
  return (
    <View className="flex-1 bg-background px-6 pt-16">
      <Text variant="display" className="mb-4">
        Salas
      </Text>
      <Text variant="body" className="mb-8 text-muted-foreground">
        Crie ou entre em uma sala colaborativa.
      </Text>
      <Link href="/room/demo" asChild>
        <Button label="Abrir sala demo" variant="primary" />
      </Link>
    </View>
  );
}
