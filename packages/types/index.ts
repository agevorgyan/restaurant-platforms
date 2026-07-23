export const packageName = '@saas/types';

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export type DeepReadonly<T> = T extends Function ? T : T extends object ? { readonly [P in keyof T]: DeepReadonly<T[P]> } : T;
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export type DeepPartial<T> = T extends Function ? T : T extends object ? { [P in keyof T]?: DeepPartial<T[P]> } : T;
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type Brand<T, Name extends string> = T & { readonly __brand: Name };
export type Result<T, E = Error> = { isSuccess: true; getValue: () => T; } | { isSuccess: false; getError: () => E; };

export type ReservationId = Brand<string, 'ReservationId'>;
export type CustomerId = Brand<string, 'CustomerId'>;
export type OrderId = Brand<string, 'OrderId'>;
export type MenuId = Brand<string, 'MenuId'>;
export type KitchenId = Brand<string, 'KitchenId'>;
export type InventoryId = Brand<string, 'InventoryId'>;
export type PaymentId = Brand<string, 'PaymentId'>;
export type EmployeeId = Brand<string, 'EmployeeId'>;
export type SupplierId = Brand<string, 'SupplierId'>;
