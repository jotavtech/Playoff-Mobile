import { useRouter } from 'expo-router';
import { Pressable, View } from 'react-native';
import { Text } from '@playoff/ui';
import { AtlasBadge } from '@/components/atlas/AtlasBadge';
import { EditorialPanel } from '@/components/atlas/EditorialPanel';
import { MetadataBar } from '@/components/atlas/MetadataBar';
import { PlayoffLogo } from '@/components/atlas/PlayoffLogo';
import { VisualShell } from '@/components/atlas/VisualShell';
import { Icon } from '@/components/ui/Icon';
import { palette } from '@/theme/tokens';

const SYSTEM_METADATA = [
  { label: 'SYS', value: 'ATLAS', tone: 'live' as const },
  { label: 'NODE', value: 'PLF_27' },
  { label: 'INFO', value: 'ABOUT' },
];

const STACK = [
  'Expo',
  'React Native',
  'Expo Router',
  'NativeWind',
  'Reanimated',
  'Zustand',
  'TanStack Query',
  'Node / Express',
  'Prisma',
  'PostgreSQL',
];

export default function AtlasScreen() {
  const router = useRouter();

  return (
    <VisualShell scroll tone="atlas" contentBottomPadding={36}>
      <View className="flex-row items-start justify-between">
        <AtlasBadge status="ABOUT" />
        <Pressable
          onPress={() => router.back()}
          hitSlop={10}
          className="h-10 w-10 items-center justify-center border active:opacity-80"
          style={{ borderColor: 'rgba(242,238,231,0.16)', borderRadius: 2 }}
          accessibilityRole="button"
          accessibilityLabel="Fechar"
        >
          <Text className="text-lg" style={{ color: palette.gray }}>
            ✕
          </Text>
        </Pressable>
      </View>

      <View className="mt-2 gap-3">
        <PlayoffLogo compact kicker="[ i ] SYSTEM INFO / DOSSIER" />
        <MetadataBar items={SYSTEM_METADATA} />
      </View>

      <EditorialPanel
        index="01"
        eyebrow="what_is_this"
        title="Curadoria e voto musical social, ao vivo."
      >
        <Text className="text-sm leading-6" style={{ color: palette.gray }}>
          O PlayOff Mobile é uma plataforma de disputas musicais em tempo real: a comunidade vota, o
          placar pulsa e a faixa líder sobe ao palco. As músicas são faixas reais do Spotify e a
          curadoria das batalhas é montada por IA via OpenAI.
        </Text>
        <Text className="text-sm leading-6" style={{ color: palette.gray }}>
          Não é um clone do Spotify nem uma playlist passiva — é um sistema social de votação, com
          ranking, histórico e salas que ganham vida a cada rodada.
        </Text>
      </EditorialPanel>

      <EditorialPanel index="02" eyebrow="atlas_ecosystem" title="Um nó do ecossistema Atlas.">
        <Text className="text-sm leading-6" style={{ color: palette.gray }}>
          O Playoff é uma peça do ecossistema Atlas: identidade visual technical-noir, design
          editorial em grid e a mesma linguagem de sistema compartilhada entre os produtos. A conta
          do Spotify é apenas a chave de acesso — o palco, o ranking e a curadoria são Atlas.
        </Text>
        <View className="flex-row gap-2">
          <View
            className="flex-1 border px-2 py-2"
            style={{ borderColor: 'rgba(242,238,231,0.12)', borderRadius: 2 }}
          >
            <Text
              className="font-mono text-[10px] uppercase"
              style={{ color: palette.grayWeak, letterSpacing: 2.4 }}
            >
              ORIGIN
            </Text>
            <Text
              className="mt-1 text-[11px] font-bold uppercase"
              style={{ color: palette.paper, letterSpacing: 1.5 }}
            >
              ATLAS / BR
            </Text>
          </View>
          <View
            className="flex-1 border px-2 py-2"
            style={{ borderColor: 'rgba(255,59,31,0.38)', borderRadius: 2 }}
          >
            <Text
              className="font-mono text-[10px] uppercase"
              style={{ color: palette.grayWeak, letterSpacing: 2.4 }}
            >
              LAYER
            </Text>
            <Text
              className="mt-1 text-[11px] font-bold uppercase"
              style={{ color: palette.orange, letterSpacing: 1.5 }}
            >
              MUSIC / SOCIAL
            </Text>
          </View>
        </View>
      </EditorialPanel>

      <EditorialPanel index="03" eyebrow="tech_stack" title="A engenharia por trás do palco.">
        <Text className="text-sm leading-6" style={{ color: palette.gray }}>
          Stack premium, mobile-first, com estado de servidor e estado de UI separados para manter a
          interface fluida mesmo sob carga ao vivo.
        </Text>
        <View className="flex-row flex-wrap gap-2">
          {STACK.map((tech) => (
            <View
              key={tech}
              className="px-2 py-1"
              style={{
                borderWidth: 1,
                borderColor: 'rgba(242,238,231,0.12)',
                backgroundColor: 'rgba(7,7,7,0.58)',
                borderRadius: 2,
              }}
            >
              <Text
                className="font-mono text-[10px] uppercase"
                style={{ color: palette.gray, letterSpacing: 1.8 }}
              >
                {tech}
              </Text>
            </View>
          ))}
        </View>
      </EditorialPanel>

      <EditorialPanel index="04" eyebrow="security" title="Segredos ficam no backend.">
        <View className="flex-row items-start gap-3">
          <View className="pt-0.5">
            <Icon name="lock" size={18} color={palette.orange} />
          </View>
          <Text className="flex-1 text-sm leading-6" style={{ color: palette.gray }}>
            Chaves e tokens sensíveis vivem apenas no servidor. O app consome somente variáveis
            públicas e fala com a API por endpoints autenticados — nenhum segredo é embarcado no
            cliente.
          </Text>
        </View>
      </EditorialPanel>

      <View
        className="mt-2 gap-2 border-t pt-4"
        style={{ borderTopColor: 'rgba(242,238,231,0.08)' }}
      >
        <Text
          className="font-mono text-[11px] uppercase"
          style={{ color: palette.paper, letterSpacing: 3.4 }}
        >
          ATLAS ECOSYSTEM // PLAYOFF
        </Text>
        <Text
          className="font-mono text-[10px] uppercase"
          style={{ color: palette.grayWeak, letterSpacing: 2.2 }}
        >
          BUILD 0.1.0 · NODE_27.12 · MUSIC SOCIAL SYSTEM
        </Text>
      </View>
    </VisualShell>
  );
}
