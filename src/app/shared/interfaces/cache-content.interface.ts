export interface CacheContent<T> {
    expiry: number;
    value: T;
}