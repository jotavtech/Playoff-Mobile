import { useRouter } from 'expo-router';
import { Pressable, View } from 'react-native';
import { Text } from '@playoff/ui';
import { AtlasBadge } from '@/components/atlas/AtlasBadge';
import { AtlasHeader } from '@/components/atlas/AtlasHeader';
import { ScreenContainer } from '@/components/atlas/ScreenContainer';
import { Avatar } from '@/components/ui/Avatar';
import { GlassCard } from '@/components/ui/GlassCard';
import { Icon } from '@/components/ui/Icon';
import { StatCard } from '@/components/ui/StatCard';
import { EmptyState, ErrorState, LoadingState } from '@/components/ui/States';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useAuthStore } from '@/store/auth.store';
import { palette } from '@/theme/tokens';

export default function ProfileScreen() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const logout = useAuthStore((s) => s.logout);
  const { data, isLoading, isError, refetch, isRefetching } = useProfile();

  if (!isAuthenticated) {
    return (
      <ScreenContainer scroll={false}>
        <AtlasHeader />
        <View className="flex-1 justify-center">
          <EmptyState
            icon="user"
            title="Perfil Atlas"
            message="Entre com Spotify para salvar votos, badges e histórico no ecossistema Atlas."
            actionLabel="Entrar com Spotify"
            onAction={() => router.push('/login')}
          />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer onRefresh={() => void refetch()} refreshing={isRefetching}>
      <AtlasHeader />

      {isLoading ? (
        <LoadingState message="Carregando seu perfil…" />
      ) : isError || !data ? (
        <ErrorState onRetry={() => void refetch()} />
      ) : (
        <>
          <View className="items-center gap-3 pt-2">
            <Avatar uri={data.user.avatarUrl} name={data.user.name} size={96} ring />
            <Text variant="display" className="text-center">
              {data.user.name}
            </Text>
            <AtlasBadge label={data.user.role === 'admin' ? 'ADMIN ATLAS' : 'PARTICIPANTE ATLAS'} />
            <Text variant="caption" className="text-center">
              Membro do ecossistema Atlas
            </Text>
          </View>

          <View className="flex-row gap-3">
            <StatCard value={data.stats.votesCount} label="Votos" tone="playoff" />
            <StatCard value={data.stats.roundsCount} label="Rodadas" tone="atlas" />
            <StatCard value={data.stats.correctCount} label="Acertos" tone="neutral" />
          </View>

          <View className="gap-3">
            <Text variant="label">Badges</Text>
            {data.badges.length === 0 ? (
              <GlassCard>
                <Text variant="caption" className="text-center">
                  Nenhum badge conquistado ainda. Participe das rodadas para desbloquear.
                </Text>
              </GlassCard>
            ) : (
              <View className="flex-row flex-wrap gap-3">
                {data.badges.map((badge) => (
                  <GlassCard key={badge.id} className="w-[47%] gap-1">
                    <Icon name="trophy" size={20} color={palette.blueGlow} />
                    <Text className="text-foreground mt-1 font-semibold">{badge.name}</Text>
                    <Text variant="caption" numberOfLines={2}>
                      {badge.description}
                    </Text>
                  </GlassCard>
                ))}
              </View>
            )}
          </View>

          <Pressable
            onPress={() => router.push('/atlas')}
            className="flex-row items-center justify-between border px-4 py-3 active:opacity-80"
            style={{ borderColor: 'rgba(242,238,231,0.12)', borderRadius: 2 }}
            accessibilityRole="button"
          >
            <View className="flex-row items-center gap-3">
              <Icon name="sparkles" size={16} color={palette.gray} />
              <View>
                <Text
                  className="text-[13px] font-bold uppercase tracking-widest"
                  style={{ color: palette.paper }}
                >
                  Sobre o Atlas
                </Text>
                <Text
                  className="font-mono text-[10px] uppercase"
                  style={{ color: palette.grayWeak, letterSpacing: 2.4 }}
                >
                  SYSTEM INFO
                </Text>
              </View>
            </View>
            <Icon name="arrow-right" size={16} color={palette.grayWeak} />
          </Pressable>

          <Pressable
            onPress={() => void logout()}
            className="border-border bg-card mt-2 items-center rounded-xl border px-5 py-3 active:opacity-80"
          >
            <Text className="text-danger text-sm font-bold uppercase tracking-widest">Sair</Text>
          </Pressable>
        </>
      )}
    </ScreenContainer>
  );
}
