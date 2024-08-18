/**
 * Shallow diff two objects or arrays
 * @param a
 * @param b
 * @returns {boolean} true if a and b are different, false otherwise
 */
export const shallowDiff = (a: any, b: any): boolean => {
  if (a === b) return false;
  if (typeof a !== typeof b) return true;
  if (typeof a !== 'object') return true;

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return true;
    for (let i = 0; i < a.length; i++) {
      if (shallowDiff(a[i], b[i])) return true;
    }
    return false;
  }

  if (Object.keys(a).length !== Object.keys(b).length) return true;

  for (let key in a) {
    if (shallowDiff(a[key], b[key])) return true;
  }

  return false;
};
