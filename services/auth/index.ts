export const login = async (address: string) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/login`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address,
        }),
      },
    );
    const data = res.json();
    return data;
  } catch (error) {
    console.log('error in login (service) => ', error);
  }
};
