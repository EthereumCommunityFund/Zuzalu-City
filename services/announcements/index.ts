import { supabase } from '@/utils/supabase/client';
import { Post } from '@/types';

type PostData = Omit<Post, 'id' | 'created_at'>;

export const getPosts = async (eventId: string) => {
  return supabase.from('eventPost').select('*').eq('eventId', eventId);
};

export const createPost = async (data: PostData) => {
  return supabase.from('eventPost').insert(data);
};

export const updatePost = async (id: string, data: PostData) => {
  return supabase.from('eventPost').update(data).eq('id', id);
};

export const deletePost = async (id: number) => {
  return supabase.from('eventPost').delete().eq('id', id);
};
