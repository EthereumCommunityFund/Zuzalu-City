import { supabase } from '@/utils/supabase/client';

interface Announcement {
  eventId: string;
  title: string;
  tags: string;
  description: string;
  creator: string;
}

export const getAnnouncements = async (eventId: string) => {
  return supabase.from('eventPost').select('*').eq('eventId', eventId);
};

export const createAnnouncement = async (data: Announcement) => {
  return supabase.from('eventPost').insert(data);
};

export const updateAnnouncement = async (id: string, data: Announcement) => {
  return supabase.from('eventPost').update(data).eq('id', id);
};

export const deleteAnnouncement = async (id: string) => {
  return supabase.from('eventPost').delete().eq('id', id);
};
