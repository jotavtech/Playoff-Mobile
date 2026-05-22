import { View } from 'react-native';
import { Text, Button } from '@playoff/ui';

export default function LoginScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-background px-8">
      <Text variant="display" className="mb-2 text-center">
        Entrar
      </Text>
      <Text variant="body" className="mb-10 text-center text-muted-foreground">
        Spotify OAuth PKCE — Phase 3
      </Text>
      <Button label="Continuar com Spotify" variant="primary" className="w-full" />
    </View>
  );
}
