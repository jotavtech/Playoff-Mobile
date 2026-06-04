import { useLocalSearchParams } from 'expo-router';
import { CinematicStage } from '@/components/playoff/CinematicStage';

export default function CinematicScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <CinematicStage roundId={typeof id === 'string' ? id : undefined} />;
}
