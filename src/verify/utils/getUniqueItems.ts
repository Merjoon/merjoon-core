export function getUniqueItems<T extends object>(allItems: T[], identityKeys: (keyof T)[]): T[] {
  const uniqueItems = allItems.reduce((uniqueMap, item) => {
    const key = identityKeys.map((identityKey) => String(item[identityKey])).join('|');
    return uniqueMap.set(key, item);
  }, new Map<string, T>());

  return Array.from(uniqueItems.values());
}
