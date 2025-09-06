export const getUniqueItems = <T extends object>(
  allItems: T[],
  comparingValues: (keyof T)[],
): T[] => {
  const uniqueItems = new Map<string, T>();

  allItems.map((item) => {
    const key = comparingValues.map((comparingValue) => String(item[comparingValue])).join('|');
    uniqueItems.set(key, item);
  });

  return Array.from(uniqueItems.values());
};
