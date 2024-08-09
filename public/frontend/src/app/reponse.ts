export interface Response<T> {
    status: number;
    message: string;
    token?: string;
    data: T[]
}

export interface ErrorResponse<T> {
    error: Response<T>
}