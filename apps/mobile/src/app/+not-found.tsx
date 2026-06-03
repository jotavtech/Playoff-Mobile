import { Link, Stack } from 'expo-router';
import { View } from 'react-native';
import { Text, Button } from '@playoff/ui';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Não encontrado' }} />
      <View className="bg-background flex-1 items-center justify-center px-6">
        <Text variant="title" className="mb-4">
          Tela não existe
        </Text>
        <Link href="/" asChild>
          <Button label="Voltar ao início" variant="secondary" />
        </Link>
      </View>
    </>
  );
}
