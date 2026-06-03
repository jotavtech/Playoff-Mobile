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
  { label: 'ROOM', value: 'PUBLIC/001', tone: 'live' as const },
  { label: 'MODE', value: 'SOCIAL VOTE' },
  { label: 'SIGNAL', value: 'ATLAS' },
];

const SYSTEM_METADATA = [
  { label: 'SYNC', value: 'REALTIME' },
  { label: 'CULTURE', value: 'MUSIC' },
  { label: 'STATUS', value: 'WAITING', tone: 'alert' as const },
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
    <VisualShell scroll tone="social" contentBottomPadding={28}>
      <View className="gap-5">
        <View className="flex-row items-start justify-between">
          <AtlasBadge tone="playoff" status="COVER" />
          <Text className="font-mono text-[10px] font-bold uppercase" style={{ color: palette.grayWeak }}>
            VOTE ENGINE / 56
          </Text>
        </View>

        <PlayoffLogo />
        <MetadataBar items={ACCESS_METADATA} />

        <EditorialPanel index="01" eyebrow="interactive cover" title="Nao e login. E a entrada do universo Playoff.">
          <Text className="text-sm leading-5" style={{ color: palette.gray }}>
            Salas ao vivo, disputa musical, curadoria Atlas e ranking social no mesmo fluxo. O
            Spotify entra como fonte, nao como destino.
          </Text>
          <View className="flex-row gap-2">
            <View className="flex-1 border px-2 py-2" style={{ borderColor: palette.paper, borderRadius: 4 }}>
              <Text className="font-mono text-[10px] font-bold uppercase" style={{ color: palette.acid }}>
                24H
              </Text>
              <Text className="mt-1 text-[11px] font-bold uppercase" style={{ color: palette.paper }}>
                rooms pulse
              </Text>
            </View>
            <View className="flex-1 border px-2 py-2" style={{ borderColor: palette.orange, borderRadius: 4 }}>
              <Text className="font-mono text-[10px] font-bold uppercase" style={{ color: palette.orange }}>
                AI
              </Text>
              <Text className="mt-1 text-[11px] font-bold uppercase" style={{ color: palette.paper }}>
                atlas picks
              </Text>
            </View>
          </View>
        </EditorialPanel>

        <EditorialPanel index="02" eyebrow="access stack" accent={palette.cyan}>
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
            <Text variant="caption" className="text-center" style={{ color: palette.orange }}>
              Configure EXPO_PUBLIC_SPOTIFY_CLIENT_ID para ativar o login Spotify.
            </Text>
          ) : null}
          {error ? (
            <Text variant="caption" className="text-center" style={{ color: palette.danger }}>
              {error}
            </Text>
          ) : null}
        </EditorialPanel>

        <View className="gap-2 border-t pt-3" style={{ borderTopColor: 'rgba(232,230,221,0.2)' }}>
          <MetadataBar items={SYSTEM_METADATA} />
          <Text className="font-mono text-[10px] leading-4" style={{ color: palette.grayWeak }}>
            Guest mode libera leitura da rodada. Voto, historico e salas persistentes exigem login.
          </Text>
        </View>
      </View>
    </VisualShell>
  );
}
