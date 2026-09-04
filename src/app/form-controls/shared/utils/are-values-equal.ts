export function areValuesEqual(valueA: any, valueB: any): boolean {
  if (Object.is(valueA, valueB)) {
    return true;
  }

  if (valueA === null || valueB === null || valueA === undefined || valueB === undefined) {
    return false;
  }

  if (typeof valueA !== 'object' || typeof valueB !== 'object') {
    return false;
  }

  if (Array.isArray(valueA) !== Array.isArray(valueB)) {
    return false;
  }

  if (Array.isArray(valueA)) {
    if (valueA.length !== valueB.length) {
      return false;
    }

    return valueA.every((item, index) => areValuesEqual(item, valueB[index]));
  }

  const keysA = Object.keys(valueA);
  const keysB = Object.keys(valueB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  return keysA.every(key => Object.prototype.hasOwnProperty.call(valueB, key) && areValuesEqual(valueA[key], valueB[key]));
}
