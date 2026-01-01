import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { BACKEND_URL } from '../config';

interface Analytics {
    totalContent: number;
    favoritesCount: number;
    foldersCount: number;
    taggedContent: number;
    contentByType: { type: string; count: number }[];
    contentOverTime: { date: string; count: number }[];
    topTags: { tag: string; count: number }[];
    recentActivity: { title: string; type: string; date: string }[];
}

export function useAnalytics() {
    return useQuery({
        queryKey: ['analytics'],
        queryFn: async () => {
            const response = await axios.get(`${BACKEND_URL}/api/v1/analytics`, {
                headers: { "Authorization": localStorage.getItem('token') }
            });
            return response.data.analytics as Analytics;
        },
        staleTime: 60 * 1000, // 1 minute cache
    });
}
