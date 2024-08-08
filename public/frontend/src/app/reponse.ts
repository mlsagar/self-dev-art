export interface Response<T> {
    status: String;
    message: string;
    token?: string;
    data: T[]
}