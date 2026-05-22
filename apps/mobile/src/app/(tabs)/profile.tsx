import { View } from 'react-native';
import { Text, Button } from '@playoff/ui';
import { Link } from 'expo-router';

export default function ProfileScreen() {
  return (
    <View className="flex-1 bg-background px-6 pt-16">
      <Text variant="display" className="mb-4">
        Perfil
      </Text>
      <Link href="/(auth)/login" asChild>
        <Button label="Entrar com Spotify" variant="primary" />
      </Link>
    </View>
  );
}
