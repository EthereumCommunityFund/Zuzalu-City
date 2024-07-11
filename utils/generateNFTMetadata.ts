import { Tag, NFTMetadata } from '@/types';
export const generateNFTMetadata = (
  name: string,
  description: string,
  image: string,
  tags: Tag[],
): NFTMetadata => {
  return {
    name,
    description,
    image,
    attributes: tags,
  };
};

export const createFileFromJSON = (jsonObject: any, filename: string): File => {
  const jsonString = JSON.stringify(jsonObject);
  const blob = new Blob([jsonString], { type: 'application/json' });
  return new File([blob], filename, { type: 'application/json' });
};
