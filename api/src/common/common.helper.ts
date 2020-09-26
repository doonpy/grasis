export function isProductionMode(): boolean {
  return process.env.NODE_ENV === 'production';
}

export function isProductionDatabase(): boolean {
  return process.env.DB_TYPE === 'production';
}
