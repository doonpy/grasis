// This file declare global type (for customization)

declare type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
