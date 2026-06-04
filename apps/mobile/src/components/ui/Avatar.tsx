import { Image } from 'expo-image';
import { View } from 'react-native';
import { Text } from '@playoff/ui';

type AvatarProps = {
  uri?: string | null;
  name?: string | null;
  size?: number;
  ring?: boolean;
};

function initials(name?: string | null): string {
  if (!name) return 'A';
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? 'A';
  const second = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? '') : '';
  return (first + second).toUpperCase();
}

export function Avatar({ uri, name, size = 48, ring = false }: AvatarProps) {
  const radius = size / 2;
  return (
    <View
      accessible
      style={{ width: size, height: size, borderRadius: radius }}
      accessibilityRole="image"
      accessibilityLabel={name ? `Foto de ${name}` : 'Foto de perfil'}
      className={`bg-card-elevated items-center justify-center overflow-hidden ${ring ? 'border-atlas/60 border-2' : 'border-border border'}`}
    >
      {uri ? (
        <Image
          source={{ uri }}
          style={{ width: size, height: size }}
          contentFit="cover"
          transition={200}
        />
      ) : (
        <Text className="text-foreground font-bold" style={{ fontSize: size * 0.36 }}>
          {initials(name)}
        </Text>
      )}
    </View>
  );
}
