import crypto from 'crypto';
import bs58 from 'bs58';
import { Dayjs } from "dayjs";

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

export function hashAndEncodeBase58(value: string): string {
  const hash = crypto.createHash('sha256').update(value).digest();

  const encoded = bs58.encode(hash);

  return encoded.slice(0, 16);
}

export const formatAmount = (amount: number, digits?: number) => {
  const amountStr = amount.toString();

  if (amount < 1000) {
    if (digits) {
      return amountStr.padStart(digits, '0');
    } else {
      return amountStr.padStart(3, '0');
    }
  } else {
    return amountStr;
  }
};

export const formatUTCTimezone = (date: Dayjs) => {
  let currentDate = new Date(date.format('YYYY-MM-DDTHH:mm:ss[Z]'));

  const timeDiff = date.utcOffset();
  if (timeDiff < 0) {
    currentDate = new Date(
      new Date(currentDate.getTime() + 24 * 60 * 60 * 1000).getTime() -
        (24 * 60 * 60 * 1000 + timeDiff * 60 * 1000),
    );
  } else {
    currentDate = new Date(
      new Date(currentDate.getTime() - 24 * 60 * 60 * 1000).getTime() -
        timeDiff * 60 * 1000,
    );
  }
  const utcYear = currentDate.getFullYear();
  const uctMM =
    String(currentDate.getMonth() + 1).length === 1
      ? `0${currentDate.getMonth() + 1}`
      : currentDate.getMonth() + 1;
  const utcDD =
    String(currentDate.getDate() + 1).length === 1
      ? `0${currentDate.getDate() + 1}`
      : currentDate.getDate() + 1;
  const utcHH =
    String(currentDate.getHours()).length === 1
      ? `0${currentDate.getHours()}`
      : currentDate.getHours();
  const utcMM =
    String(currentDate.getMinutes()).length === 1
      ? `0${currentDate.getMinutes()}`
      : currentDate.getMinutes();
  const utcSS =
    String(currentDate.getSeconds()).length === 1
      ? `0${currentDate.getSeconds()}`
      : currentDate.getSeconds();

  return `${utcYear}-${uctMM}-${utcDD}T${utcHH}:${utcMM}:${utcSS}Z`;
};
