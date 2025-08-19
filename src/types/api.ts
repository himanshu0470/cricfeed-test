export interface ApiResponse<T = any> {
    success: boolean;
    status: number;
    result: T;
    title: string;
    message: string;
}