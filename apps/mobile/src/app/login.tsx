import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { View } from 'react-native';
import { Text } from '@playoff/ui';
import { AtlasBadge } from '@/components/atlas/AtlasBadge';
import { EditorialPanel } from '@/components/atlas/EditorialPanel';
import { MetadataBar } from '@/components/atlas/MetadataBar';
import { PlayoffLogo } from '@/components/atlas/PlayoffLogo';
import { PrimaryCTA, SecondaryCTA } from '@/components/atlas/PlayoffCTA';
import { VisualShell } from '@/components/atlas/VisualShell';
import { useAuth, useSpotifyLogin } from '@/hooks/useAuth';
import { useAuthStore } from '@/store/auth.store';
import { palette } from '@/theme/tokens';

const ACCESS_METADATA = [
  { label: 'SYS', value: 'ONLINE', tone: 'live' as const },
  { label: 'NODE', value: 'PLF_01' },
  { label: 'MODE', value: 'ENTRY' },
];

const SYSTEM_METADATA = [
  { label: 'AUTH', value: 'SPOTIFY' },
  { label: 'ROOMS', value: 'SOCIAL' },
  { label: 'REC', value: 'ON', tone: 'alert' as const },
];

export default function LoginScreen() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const continueAsGuest = useAuthStore((s) => s.continueAsGuest);
  const { login, error, ready, isLoading } = useSpotifyLogin();

  useEffect(() => {
    if (isAuthenticated && router.canGoBack()) router.back();
  }, [isAuthenticated, router]);

  return (
    <VisualShell scroll tone="playoff" contentBottomPadding={28}>
      <View className="gap-6">
        <View className="flex-row items-start justify-between">
          <AtlasBadge label="PLAYOFF" tone="playoff" status="ENTRY" />
          <Text
            className="font-mono text-[10px] uppercase"
            style={{ color: palette.grayWeak, letterSpacing: 2.4 }}
          >
            BRT / NODE_02
          </Text>
        </View>

        <View className="mt-10">
          <PlayoffLogo kicker="[ NODE_27.12.05 ] / ATLAS MUSIC SYSTEM" />
        </View>
        <MetadataBar items={ACCESS_METADATA} />

        <EditorialPanel
          index="01"
          eyebrow="dossier_2026"
          title="Capa interativa do universo Playoff."
        >
          <Text className="text-sm leading-6" style={{ color: palette.gray }}>
            Salas ao vivo, voto musical, curadoria Atlas e ranking social em uma interface de
            sistema. Spotify é apenas a chave de acesso.
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
                STATUS
              </Text>
              <Text
                className="mt-1 text-[11px] font-bold uppercase"
                style={{ color: palette.orange, letterSpacing: 1.5 }}
              >
                AVAILABLE
              </Text>
            </View>
          </View>
        </EditorialPanel>

        <EditorialPanel index="02" eyebrow="access_stack">
          <View className="gap-3">
            <PrimaryCTA
              icon="spotify"
              label="Entrar com Spotify"
              loading={isLoading}
              disabled={!ready || isLoading}
              onPress={() => void login()}
            />
            <SecondaryCTA
              icon="external"
              label="Explorar como convidado"
              onPress={() => {
                continueAsGuest();
                if (router.canGoBack()) router.back();
              }}
            />
          </View>

          {!ready ? (
            <View className="gap-1">
              <Text
                className="text-center font-mono text-[10px] uppercase"
                style={{ color: palette.orange, letterSpacing: 2.4 }}
              >
                AUTH / UNAVAILABLE
              </Text>
              <Text variant="caption" className="text-center" style={{ color: palette.gray }}>
                Login com Spotify indisponível — configuração ausente. Continue como convidado.
              </Text>
            </View>
          ) : null}
          {error ? (
            <Text variant="caption" className="text-center" style={{ color: palette.danger }}>
              {error}
            </Text>
          ) : null}
        </EditorialPanel>

        <View className="gap-2 border-t pt-3" style={{ borderTopColor: 'rgba(242,238,231,0.08)' }}>
          <MetadataBar items={SYSTEM_METADATA} />
          <Text
            className="font-mono text-[10px] leading-5"
            style={{ color: palette.grayWeak, letterSpacing: 1.8 }}
          >
            GUEST MODE libera leitura da rodada. VOTO / HISTORY / ROOMS persistentes exigem login.
          </Text>
        </View>
      </View>
    </VisualShell>
  );
}
