export const isMobile = (): boolean => {
  let flag: RegExpMatchArray | null = navigator.userAgent.match(
    /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i,
  );
  if (!flag) {
    return false;
  } else if (flag.length > 0) {
    return true;
  }
  return false;
};

export const convertDateStringFormat = (dateString: string): string => {
  const date = new Date(dateString);

  // Get the month name and day of the month
  const monthName = date.toLocaleString('default', { month: 'long' });
  const dayOfMonth = date.getDate();

  // Construct the desired output string
  const formattedDate = `${monthName} ${dayOfMonth}`;

  return formattedDate;
};

export function uint8ArrayToBase64(array: Uint8Array): string {
  return btoa(String.fromCharCode.apply(null, Array.from(array)));
}

export function base64ToUint8Array(base64: string): Uint8Array {
  return Uint8Array.from([...atob(base64)].map((char) => char.charCodeAt(0)));
}
