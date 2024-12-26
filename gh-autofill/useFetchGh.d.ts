export declare function useFetchGh<T>(url: string, condition?: boolean): {
    isFetching: boolean;
    data: T[];
    error: string;
};
