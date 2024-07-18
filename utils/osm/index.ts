import * as Nominatim from 'nominatim-browser';
import { LatLngLiteral } from 'leaflet';

const getLatLngFromAddress = async (
  address: string,
): Promise<LatLngLiteral | undefined> => {
  try {
    const res = await Nominatim.geocode({
      q: address,
    });
    if (res && res.length > 0) {
      return {
        lat: parseFloat(res[0].lat),
        lng: parseFloat(res[0].lon),
      };
    } else {
      throw new Error('No results found');
    }
  } catch (error) {
    console.error('Error fetching the geolocation:', error);
    return undefined;
  }
};

export default getLatLngFromAddress;
