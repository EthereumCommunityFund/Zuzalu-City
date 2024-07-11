import { NEXT_PUBLIC_API_BASE_URL } from '@/constant';

export const createVenue = async (venuePayload: any) => {
  // try {
  const res = await fetch(`/api/admin/createVenue`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(venuePayload),
  });
  // const data = res.json();
  // return data;
  // } catch (error) {
  //   console.log('Error fetching data:', error);
  // }
};
