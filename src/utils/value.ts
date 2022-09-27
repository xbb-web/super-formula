export const deepGet = (obj: any, keys: string) => {
  return (
    keys
      .replace(/\[/g, '.')
      .replace(/\]/g, '')
      .split('.')
      .reduce((o: any, k: string) => (o || {})[k], obj)
  );
};
