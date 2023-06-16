import { apiClient } from '../utils';

export type NetworkInterface = {
  id: number;
  state: boolean | null;
  ip_address: string | null;
  name: string;
  mac_address: string;
};

export const getInterfaces = async (): Promise<NetworkInterface[]> => {
  const response = await apiClient.get('api/v1/network/interfaces/', {});
  if (response.status === 200) {
    const data = await response.data;
    return data;
  }
  throw new Error('Request failed');
};
