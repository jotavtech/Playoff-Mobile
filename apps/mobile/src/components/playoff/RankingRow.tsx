import { Image } from 'expo-image';
import { View } from 'react-native';
import { Text } from '@playoff/ui';
import type { RankingItem } from '@playoff/types';
import { Icon } from '@/components/ui/Icon';
import { formatVotes } from '@/utils/round';
import { palette } from '@/theme/tokens';

const MEDAL = [palette.medalGold, palette.medalSilver, palette.medalBronze];

export function RankingRow({ item }: { item: RankingItem }) {
  const medal = item.position <= 3 ? MEDAL[item.position - 1] : undefined;
  return (
    <View className="border-border bg-card flex-row items-center gap-3 rounded-2xl border p-3">
      <View className="w-7 items-center">
        <Text className="text-base font-extrabold" style={{ color: medal ?? palette.gray }}>
          {item.position}
        </Text>
      </View>
      <Image
        source={{ uri: item.song.coverUrl }}
        style={{ width: 46, height: 46, borderRadius: 10 }}
        contentFit="cover"
        transition={200}
      />
      <View className="flex-1">
        <Text className="text-foreground font-semibold" numberOfLines={1}>
          {item.song.title}
        </Text>
        <Text variant="caption" numberOfLines={1}>
          {item.song.artist}
        </Text>
      </View>
      <View className="items-end">
        <Text className="text-foreground font-bold">{formatVotes(item.votes)}</Text>
        <Text variant="caption">{item.percentage}%</Text>
      </View>
      {item.isWinner ? <Icon name="trophy" size={16} color={palette.blueGlow} /> : null}
    </View>
  );
}
