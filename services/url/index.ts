import { covertNameToUrlName } from '@/utils/format';
import { supabase } from '@/utils/supabase/client';

const getLastUrl = async (name: string) => {
  const { data, error } = await supabase
    .from('url')
    .select('*')
    .eq('name', name)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  return { data, error };
};

const getUrlFromIdAndName = async (ceramicId: string, name: string) => {
  const nameFiled = covertNameToUrlName(name);
  const { data, error } = await supabase
    .from('url')
    .select('*')
    .eq('name', nameFiled)
    .eq('ceramicId', ceramicId)
    .single();
  return { data, error };
};

const createUrl = async (
  name: string,
  ceramicId: string,
  type: 'spaces' | 'events',
) => {
  const url = await getLastUrl(name);
  let hash = 0;
  if (url.data) {
    hash = Number(url.data.hash) + 1;
  }
  const { data, error } = await supabase.from('url').insert({
    name,
    hash,
    ceramicId,
    type,
  });
  return { data, error };
};

export { getUrlFromIdAndName, createUrl };
