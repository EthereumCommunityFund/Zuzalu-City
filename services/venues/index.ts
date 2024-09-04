import { supabase } from '@/utils/supabase/client';

export const getVenues = async (eventId: string) => {
  return supabase.from('venues').select('*').eq('eventId', eventId);
};
