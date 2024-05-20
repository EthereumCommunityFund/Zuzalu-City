export const createLocation = async (locationPayload: any) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/createLocation`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ locationPayload }),
      },
    );
    const data = res.json();
    return data;
  } catch (error) {
    console.log('Error fetching data:', error);
  }
};
