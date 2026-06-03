import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';
import { Text } from '@playoff/ui';
import { AtlasBadge } from '@/components/atlas/AtlasBadge';
import { ScreenContainer } from '@/components/atlas/ScreenContainer';
import { Icon } from '@/components/ui/Icon';
import { useAuth, useSpotifyLogin } from '@/hooks/useAuth';
import { useAuthStore } from '@/store/auth.store';
import { palette } from '@/theme/tokens';

export default function LoginScreen() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const continueAsGuest = useAuthStore((s) => s.continueAsGuest);
  const { login, error, ready, isLoading } = useSpotifyLogin();

  useEffect(() => {
    if (isAuthenticated && router.canGoBack()) router.back();
  }, [isAuthenticated, router]);

  return (
    <ScreenContainer scroll={false} tone="atlas">
      <View className="flex-1 justify-center gap-8">
        <View className="items-center gap-3">
          <AtlasBadge />
          <Text className="text-foreground text-2xl font-extrabold uppercase tracking-[5px]">
            Playoff Mobile
          </Text>
        </View>

        <View className="gap-2">
          <Text variant="display" className="text-center">
            Entre no Atlas Playoff
          </Text>
          <Text variant="caption" className="text-center leading-5">
            Sua jornada musical começa com sua conta Spotify. Vote, descubra e suba no ranking.
          </Text>
        </View>

        <View className="gap-3">
          <Pressable
            onPress={() => void login()}
            disabled={!ready || isLoading}
            className={`h-14 flex-row items-center justify-center gap-2 rounded-2xl ${ready && !isLoading ? 'bg-playoff active:opacity-90' : 'bg-card-elevated opacity-70'}`}
            accessibilityRole="button"
          >
            {isLoading ? (
              <ActivityIndicator color={palette.white} />
            ) : (
              <>
                <Icon name="spotify" size={20} color={palette.white} />
                <Text className="text-sm font-bold uppercase tracking-widest text-white">
                  Entrar com Spotify
                </Text>
              </>
            )}
          </Pressable>

          <Pressable
            onPress={() => {
              continueAsGuest();
              if (router.canGoBack()) router.back();
            }}
            className="border-border h-12 items-center justify-center rounded-2xl border active:opacity-80"
          >
            <Text className="text-muted text-sm font-semibold">Continuar sem conta</Text>
          </Pressable>

          {!ready ? (
            <Text variant="caption" className="text-muted-weak text-center">
              Configure EXPO_PUBLIC_SPOTIFY_CLIENT_ID para habilitar o login.
            </Text>
          ) : null}
          {error ? (
            <Text variant="caption" className="text-danger text-center">
              {error}
            </Text>
          ) : null}
        </View>

        <Text variant="caption" className="text-muted-weak text-center">
          Sem conta você pode explorar rodadas, mas não votar nem salvar histórico.
        </Text>
      </View>
    </ScreenContainer>
  );
}
