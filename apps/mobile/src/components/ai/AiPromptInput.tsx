import { useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';
import { Icon } from '@/components/ui/Icon';
import { palette } from '@/theme/tokens';

type AiPromptInputProps = {
  onSubmit: (prompt: string) => void;
  loading?: boolean;
  placeholder?: string;
};

export function AiPromptInput({
  onSubmit,
  loading = false,
  placeholder = 'Ex: rodada com vibe noturna e indie melancólico',
}: AiPromptInputProps) {
  const [value, setValue] = useState('');

  const submit = () => {
    const text = value.trim();
    if (!text || loading) return;
    onSubmit(text);
  };

  return (
    <View className="border-border bg-card flex-row items-end gap-2 rounded-2xl border p-2">
      <TextInput
        value={value}
        onChangeText={setValue}
        placeholder={placeholder}
        placeholderTextColor={palette.grayWeak}
        multiline
        className="text-foreground max-h-28 flex-1 px-2 py-2 text-base"
        style={{ color: palette.white }}
        onSubmitEditing={submit}
      />
      <Pressable
        onPress={submit}
        disabled={loading || value.trim().length === 0}
        className={`h-11 w-11 items-center justify-center rounded-xl ${value.trim().length === 0 || loading ? 'bg-card-elevated' : 'bg-atlas active:opacity-90'}`}
        accessibilityRole="button"
        accessibilityLabel="Enviar para a IA"
      >
        <Icon name="arrow-right" size={20} color={palette.white} />
      </Pressable>
    </View>
  );
}
