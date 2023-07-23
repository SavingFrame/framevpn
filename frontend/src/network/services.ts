import { api } from '../core/store/api';

export type NetworkInterface = {
  id: number;
  state: boolean | null;
  ip_address: string | null;
  name: string;
  mac_address: string;
};

export const networkApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getNetworkInterfaces: builder.query<NetworkInterface[], void>({
      query: () => ({ url: '/api/v1/network/interfaces/', method: 'GET' }),
    }),
  }),
});

export const { useGetNetworkInterfacesQuery } = networkApi;
