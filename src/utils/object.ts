export function parseObject(value: Object | string) {
  if (typeof value === 'string') {
    return JSON.parse(value);
  }

  return value;
}
