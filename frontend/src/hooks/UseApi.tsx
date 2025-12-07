import { useState, useEffect } from 'react';

export interface ApiResponse<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
    refresh: () => void;
}


export const useApiData = <T,>(url: string): ApiResponse<T> => {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [refetchTrigger, setRefetchTrigger] = useState(0);

    useEffect(() => {
        setLoading(true);
        setError(null);

        const controller = new AbortController();

        fetch(url, { signal: controller.signal })
            .then(res => {
                if (res.status === 304) {
                    console.warn("Resource not modified (304). Ensure browser cache is enabled.");
                    return null;
                }

                if (!res.ok) {
                    throw new Error(`Error: ${res.status} ${res.statusText}`);
                }

                const contentType = res.headers.get("content-type");
                if (contentType && contentType.indexOf("application/json") !== -1) {
                    return res.json();
                } else {
                    return null;
                }
            })
            .then(json => {
                if (json) {
                    setData(json as T);
                }
                setLoading(false);
            })
            .catch(err => {
                if (err.name !== 'AbortError') {
                    setError(err.message);
                    setLoading(false);
                }
            });

        return () => controller.abort();

    }, [url, refetchTrigger]);

    const refresh = () => setRefetchTrigger(prev => prev + 1);

    return { data, loading, error, refresh };
};
