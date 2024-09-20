import { supabase } from '@/utils/supabase/client';

export const getAnnouncements = async (eventId: string) => {
  return supabase.from('eventPost').select('*').eq('eventId', eventId);
};
