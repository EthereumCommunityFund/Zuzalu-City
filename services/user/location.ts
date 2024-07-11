export const getLocation = async (locationId: any) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/getLocation`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ locationId }),
      },
    );
    const data = res.json();
    return data;
  } catch (error) {
    console.log('Error fetching data:', error);
  }
};
