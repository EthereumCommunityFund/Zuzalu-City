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
