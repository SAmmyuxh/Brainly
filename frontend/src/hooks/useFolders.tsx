import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { BACKEND_URL } from '../config';
import { toast } from 'sonner';

interface Folder {
    _id: string;
    name: string;
    description?: string;
    color: string;
    icon: string;
    contentCount: number;
    createdAt: string;
}

export function useFolders() {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ['folders'],
        queryFn: async () => {
            const response = await axios.get(`${BACKEND_URL}/api/v1/folders`, {
                headers: { "Authorization": localStorage.getItem('token') }
            });
            return response.data.folders as Folder[];
        },
        staleTime: 30 * 1000,
    });

    const createFolder = useMutation({
        mutationFn: async (data: { name: string; description?: string; color?: string }) => {
            return axios.post(`${BACKEND_URL}/api/v1/folders`, data, {
                headers: { "Authorization": localStorage.getItem('token') }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['folders'] });
            toast.success("Folder created!");
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || "Failed to create folder");
        }
    });

    const updateFolder = useMutation({
        mutationFn: async (data: { folderId: string; name: string; description?: string; color?: string }) => {
            return axios.put(`${BACKEND_URL}/api/v1/folders`, data, {
                headers: { "Authorization": localStorage.getItem('token') }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['folders'] });
            toast.success("Folder updated!");
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || "Failed to update folder");
        }
    });

    const deleteFolder = useMutation({
        mutationFn: async (folderId: string) => {
            return axios.delete(`${BACKEND_URL}/api/v1/folders`, {
                data: { folderId },
                headers: { "Authorization": localStorage.getItem('token') }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['folders'] });
            queryClient.invalidateQueries({ queryKey: ['content'] });
            toast.success("Folder deleted!");
        },
        onError: () => toast.error("Failed to delete folder")
    });

    const moveToFolder = useMutation({
        mutationFn: async ({ contentId, folderId }: { contentId: string; folderId: string | null }) => {
            return axios.post(`${BACKEND_URL}/api/v1/folders/move`, { contentId, folderId }, {
                headers: { "Authorization": localStorage.getItem('token') }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['content'] });
            queryClient.invalidateQueries({ queryKey: ['folders'] });
            toast.success("Content moved!");
        },
        onError: () => toast.error("Failed to move content")
    });

    const toggleFavorite = useMutation({
        mutationFn: async (contentId: string) => {
            return axios.post(`${BACKEND_URL}/api/v1/content/favorite`, { contentId }, {
                headers: { "Authorization": localStorage.getItem('token') }
            });
        },
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ['content'] });
            toast.success(res.data.message);
        },
        onError: () => toast.error("Failed to update favorite")
    });

    return {
        folders: query.data || [],
        isLoading: query.isLoading,
        createFolder,
        updateFolder,
        deleteFolder,
        moveToFolder,
        toggleFavorite,
    };
}
