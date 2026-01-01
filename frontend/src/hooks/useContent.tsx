import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import { BACKEND_URL } from '../config';

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

interface ContentResponse {
  content: any[];
  pagination: PaginationInfo;
  search?: string | null;
}

export function useContent(search?: string) {
  const query = useInfiniteQuery({
    queryKey: ['content', search || ''],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await axios.get<ContentResponse>(`${BACKEND_URL}/api/v1/content`, {
        params: {
          page: pageParam,
          limit: 12,
          ...(search && search.trim() ? { search: search.trim() } : {})
        },
        headers: {
          "Authorization": localStorage.getItem('token')
        }
      });
      return response.data;
    },
    getNextPageParam: (lastPage) => {
      return lastPage.pagination.hasMore ? lastPage.pagination.page + 1 : undefined;
    },
    initialPageParam: 1,
    staleTime: 5 * 1000,
  });

  // Flatten all pages into single content array
  const allContent = query.data?.pages.flatMap(page => page.content) || [];

  return {
    ...query,
    data: allContent,
    pagination: query.data?.pages[query.data.pages.length - 1]?.pagination,
  };
}
