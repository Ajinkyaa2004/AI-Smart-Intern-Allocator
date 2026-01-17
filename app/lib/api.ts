const API_BASE_URL = 'http://localhost:3000/api/v1';

export const fetcher = async (url: string, token: string) => {
    const res = await fetch(`${API_BASE_URL}${url}`, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'API request failed');
    }

    return res.json();
};
