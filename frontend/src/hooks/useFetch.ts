import { useEffect, useState, useCallback } from 'react';

interface UseFetchOptions {
    method?: string;
    headers?: Record<string, string>;
    body?: any;
}

interface UseFetchState<T> {
    data: T | null;
    loading: boolean;
    error: Error | null;
}

export function useFetch<T>(
    url: string,
    options?: UseFetchOptions
): UseFetchState<T> & { refetch: () => Promise<void> } {
    const [state, setState] = useState<UseFetchState<T>>({
        data: null,
        loading: true,
        error: null,
    });

    const fetchData = useCallback(async () => {
        try {
            setState((prev) => ({ ...prev, loading: true }));
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
            const fullUrl = url.startsWith('http') ? url : `${apiUrl}${url}`;

            const response = await globalThis.fetch(fullUrl, {
                method: options?.method || 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...options?.headers,
                },
                ...(options?.body && { body: JSON.stringify(options.body) }),
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.statusText}`);
            }

            const data = await response.json();
            setState({ data, loading: false, error: null });
        } catch (error) {
            setState({
                data: null,
                loading: false,
                error: error instanceof Error ? error : new Error('Unknown error'),
            });
        }
    }, [url, options]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { ...state, refetch: fetchData };
}
