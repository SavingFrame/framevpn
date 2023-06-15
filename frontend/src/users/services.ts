import { apiClient } from '../utils';
import { PaginatedResponse } from '../core/services';

export type UserListResponse = {
  id: number;
  email: string;
  is_active: boolean;
  first_name: string | null;
  last_name: string | null;
  is_superuser: boolean;
};

type UserListPaginatedResponse = PaginatedResponse & {
  items: UserListResponse[];
};

// eslint-disable-next-line import/prefer-default-export
export const getUsers = async (
  page: number = 1,
  size: number = 20
): Promise<UserListPaginatedResponse> => {
  const response = await apiClient.get('api/v1/users/', {
    params: {
      page,
      size,
    },
  });
  if (response.status === 200) {
    const data = await response.data;
    return data;
  }
  throw new Error('Request failed');
};
