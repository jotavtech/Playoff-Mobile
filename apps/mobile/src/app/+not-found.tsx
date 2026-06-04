import { Stack, useRouter } from 'expo-router';
import { Pressable, View } from 'react-native';
import { Text } from '@playoff/ui';
import { EditorialPanel } from '@/components/atlas/EditorialPanel';
import { VisualShell } from '@/components/atlas/VisualShell';
import { Icon } from '@/components/ui/Icon';
import { palette } from '@/theme/tokens';

export default function NotFoundScreen() {
  const router = useRouter();

  return (
    <>
      <Stack.Screen options={{ title: 'Rota não encontrada' }} />
      <VisualShell scroll={false} tone="atlas">
        <View className="flex-1 justify-center gap-5">
          <Text
            className="font-mono text-[10px] uppercase"
            style={{ color: palette.orange, letterSpacing: 3.4 }}
          >
            404 / ROUTE NOT FOUND
          </Text>

          <EditorialPanel index="404" eyebrow="dead_link" title="Esta rota saiu do palco.">
            <Text className="text-sm leading-6" style={{ color: palette.gray }}>
              O endereço acessado não existe no sistema Atlas ou foi movido. Volte ao início para
              retomar a disputa.
            </Text>
            <Pressable
              onPress={() => router.replace('/')}
              className="mt-1 h-12 flex-row items-center justify-center gap-2 border active:opacity-90"
              style={{ borderColor: 'rgba(255,59,31,0.38)', borderRadius: 2 }}
              accessibilityRole="button"
              accessibilityLabel="Voltar ao início"
            >
              <Icon name="home" size={16} color={palette.orange} />
              <Text
                className="text-xs font-bold uppercase"
                style={{ color: palette.paper, letterSpacing: 2.4 }}
              >
                Voltar ao início
              </Text>
              <Text
                className="font-mono text-[10px] uppercase"
                style={{ color: palette.orange, letterSpacing: 2.4 }}
              >
                HOME
              </Text>
            </Pressable>
          </EditorialPanel>

          <Text
            className="font-mono text-[10px] uppercase"
            style={{ color: palette.grayWeak, letterSpacing: 2.2 }}
          >
            ATLAS ECOSYSTEM // PLAYOFF · SYS_ERR
          </Text>
        </View>
      </VisualShell>
    </>
  );
}
