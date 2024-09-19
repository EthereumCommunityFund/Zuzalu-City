import { getUrlFromIdAndName } from '@/services/url';
import { useQuery } from '@tanstack/react-query';

interface IUseGetShareLink {
  id: string;
  name?: string;
}

const useGetShareLink = ({ id, name }: IUseGetShareLink) => {
  const { data: shareUrl } = useQuery({
    queryKey: ['getUrlFromIdAndName', name],
    queryFn: () => {
      return getUrlFromIdAndName(id, name!);
    },
    enabled: !!(id && name),
    select: ({ data }) => {
      if (data) {
        const { name, hash, type } = data;
        return `${window.location.origin}/${type === 'spaces' ? 's' : 'e'}/${name}${hash !== '0' ? `/${hash}` : ''}`;
      }
    },
  });

  return { shareUrl };
};

export default useGetShareLink;
