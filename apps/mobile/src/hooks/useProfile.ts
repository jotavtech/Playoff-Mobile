import { QUERY_KEYS } from '@playoff/config';
import { useQuery } from '@tanstack/react-query';
import { profileService } from '@/services/profile.service';
import { useAuth } from './useAuth';

export function useProfile() {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: QUERY_KEYS.profile,
    queryFn: () => profileService.profile(),
    enabled: isAuthenticated,
  });
}

export function useHistory() {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: QUERY_KEYS.history,
    queryFn: () => profileService.history(),
    enabled: isAuthenticated,
  });
}
