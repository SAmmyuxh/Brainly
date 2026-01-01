import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { BACKEND_URL } from '../config';
import { toast } from 'sonner';

interface ReviewItem {
    _id: string;
    contentId: {
        _id: string;
        title: string;
        description?: string;
        type: string;
        link?: string;
        content?: string;
        tags?: string[];
    };
    easeFactor: number;
    interval: number;
    repetitions: number;
    status: 'new' | 'learning' | 'reviewing' | 'mastered';
    nextReviewDate: string;
    totalReviews: number;
    correctCount: number;
}

interface ReviewStats {
    byStatus: { new?: number; learning?: number; reviewing?: number; mastered?: number };
    dueToday: number;
    totalReviews: number;
    correctCount: number;
    accuracy: number;
}

export function useReviews() {
    const queryClient = useQueryClient();

    const dueReviews = useQuery({
        queryKey: ['reviews', 'due'],
        queryFn: async () => {
            const response = await axios.get(`${BACKEND_URL}/api/v1/reviews`, {
                params: { limit: 20 },
                headers: { "Authorization": localStorage.getItem('token') }
            });
            return response.data.reviews as ReviewItem[];
        },
        staleTime: 30 * 1000,
    });

    const stats = useQuery({
        queryKey: ['reviews', 'stats'],
        queryFn: async () => {
            const response = await axios.get(`${BACKEND_URL}/api/v1/reviews/stats`, {
                headers: { "Authorization": localStorage.getItem('token') }
            });
            return response.data.stats as ReviewStats;
        },
        staleTime: 60 * 1000,
    });

    const addToReview = useMutation({
        mutationFn: async (contentId: string) => {
            return axios.post(`${BACKEND_URL}/api/v1/reviews`, { contentId }, {
                headers: { "Authorization": localStorage.getItem('token') }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reviews'] });
            toast.success("Added to Memory Vault!");
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || "Failed to add to review");
        }
    });

    const submitReview = useMutation({
        mutationFn: async ({ reviewId, quality }: { reviewId: string; quality: number }) => {
            return axios.post(`${BACKEND_URL}/api/v1/reviews/submit`, { reviewId, quality }, {
                headers: { "Authorization": localStorage.getItem('token') }
            });
        },
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ['reviews'] });
            toast.success(res.data.message);
        },
        onError: () => toast.error("Failed to submit review")
    });

    const removeFromReview = useMutation({
        mutationFn: async (contentId: string) => {
            return axios.delete(`${BACKEND_URL}/api/v1/reviews`, {
                data: { contentId },
                headers: { "Authorization": localStorage.getItem('token') }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reviews'] });
            toast.success("Removed from Memory Vault");
        },
        onError: () => toast.error("Failed to remove from review")
    });

    return {
        dueReviews: dueReviews.data || [],
        stats: stats.data,
        isLoading: dueReviews.isLoading || stats.isLoading,
        addToReview,
        submitReview,
        removeFromReview,
    };
}
