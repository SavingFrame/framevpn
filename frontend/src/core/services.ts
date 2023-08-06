import { apiClient } from '../utils';
import { logout } from '../auth/services';

export type PaginatedResponse = {
  items: Array<object>;
  total: number;
  page: number;
  size: number;
  pages: number;
};

export const setupResponseInterceptor = (navigate: any) => {
  apiClient.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response.status === 401) {
        logout();
        navigate('/login');
      }
      if (
        error.response.status === 400 &&
        error.response.data.detail === 'Initial setup not configured'
      ) {
        navigate('/initial-setup');
      }
      return Promise.reject(error);
    }
  );
};
