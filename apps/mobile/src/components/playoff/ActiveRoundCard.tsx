import { Pressable, View } from 'react-native';
import { Text } from '@playoff/ui';
import type { Round } from '@playoff/types';
import { Icon } from '@/components/ui/Icon';
import { formatVotes, statusLabel } from '@/utils/round';
import { palette } from '@/theme/tokens';

type ActiveRoundCardProps = {
  round: Round;
  onPress: () => void;
};

export function ActiveRoundCard({ round, onPress }: ActiveRoundCardProps) {
  return (
    <Pressable
      onPress={onPress}
      className="border-atlas/30 bg-card-elevated overflow-hidden rounded-3xl border p-5 active:opacity-90"
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <View className="bg-playoff h-2 w-2 rounded-full" />
          <Text className="text-playoff text-[11px] font-bold uppercase tracking-[3px]">
            {statusLabel(round.status)}
          </Text>
        </View>
        <Text variant="caption">{formatVotes(round.totalVotes)} votos</Text>
      </View>

      <Text className="text-foreground mt-3 text-2xl font-extrabold" numberOfLines={2}>
        {round.title}
      </Text>
      {round.description ? (
        <Text variant="caption" className="mt-1 leading-5" numberOfLines={2}>
          {round.description}
        </Text>
      ) : null}

      <View className="mt-4 flex-row items-center justify-between">
        <Text variant="caption">{round.songs.length} faixas em disputa</Text>
        <View className="bg-playoff flex-row items-center gap-1 rounded-full px-4 py-2">
          <Text className="text-xs font-bold uppercase tracking-widest text-white">Votar</Text>
          <Icon name="arrow-right" size={14} color={palette.white} />
        </View>
      </View>
    </Pressable>
  );
}
