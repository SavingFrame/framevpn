import { api } from '../core/store/api';

export type WireguardNetworkInterface = {
  uuid: string;
  state: string;
  description: string;
  ip_address: string;
  name: string;
  listen_port: number;
  count_peers: number;
};

export type CreateWireguardNetworkInterface = {
  name: string;
  description: string;
  ip_address: string;
  listen_port: number;
  on_up: string[];
  on_down: string[];
  gateway_interface: string;
};

export type CreateInterfaceDefaultValues = {
  name: string;
  gateway_interface: string;
  ip_address: string;
  on_up: string[];
  on_down: string[];
  port_number: string;
};

export type DetailWireguardInterface = {
  uuid: string;
  state: string;
  gateway_interface: string;
  on_up: string[];
  on_down: string[];
  name: string;
  description: string;
  ip_address: string;
  listen_port: number;
};

export type InterfacePeer = {
  uuid: string;
  description: string;
  dns1: string;
  dns2: string;
  name: string;
  state: string;
};

export const wireguardApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getWireguardInterfaces: builder.query<WireguardNetworkInterface[], void>({
      query: () => ({ url: '/api/v1/wireguard/interfaces/', method: 'GET' }),
    }),
    getDetailWireguardInterface: builder.query<
      DetailWireguardInterface,
      string
    >({
      query: (uuid) => ({
        url: `/api/v1/wireguard/interfaces/${uuid}/`,
        method: 'GET',
      }),
    }),
    getInterfacePeers: builder.query<InterfacePeer[], string>({
      query: (uuid) => ({
        url: `/api/v1/wireguard/interfaces/${uuid}/peers`,
        method: 'GET',
      }),
    }),
    getCreateInterfaceDefaultValues: builder.query<
      CreateInterfaceDefaultValues,
      void
    >({
      query: () => ({
        url: '/api/v1/wireguard/interfaces/create_default_values/',
        method: 'GET',
      }),
    }),
    addWireguardInterface: builder.mutation<
      WireguardNetworkInterface,
      CreateWireguardNetworkInterface
    >({
      query: (body) => ({
        url: '/api/v1/wireguard/interfaces/',
        method: 'POST',
        data: body,
      }),
      // invalidatesTags: [{type: 'Posts', id: 'LIST'}],
    }),
    deleteWireguardInterface: builder.mutation<void, string>({
      query: (uuid) => ({
        url: `/api/v1/wireguard/interfaces/${uuid}/`,
        method: 'DELETE',
      }),
    }),
    changeStatusWireguardInterface: builder.mutation<
      DetailWireguardInterface,
      { uuid: string; toStatus: boolean }
    >({
      query: ({ uuid, toStatus }) => ({
        url: `/api/v1/wireguard/interfaces/${uuid}/${
          toStatus === true ? 'up' : 'down'
        }/`,
        method: 'POST',
      }),
    }),
  }),
});

export const {
  useGetWireguardInterfacesQuery,
  useGetCreateInterfaceDefaultValuesQuery,
  useAddWireguardInterfaceMutation,
  useGetDetailWireguardInterfaceQuery,
  useGetInterfacePeersQuery,
  useDeleteWireguardInterfaceMutation,
  useChangeStatusWireguardInterfaceMutation,
} = wireguardApi;
