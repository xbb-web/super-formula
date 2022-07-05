export const deepGet = (obj, keys, defaultVal?) => {
  return (
    (!Array.isArray(keys)
      ? keys.replace(/\[/g, '.').replace(/\]/g, '').split('.')
      : keys
    ).reduce((o, k) => (o || {})[k], obj) || defaultVal
  );
}