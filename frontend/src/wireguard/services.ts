import { api } from '../core/store/api';

type WireguardServer = {
  uuid: string;
  name: string;
  endpoint: string;
};

export type WireguardNetworkInterface = {
  uuid: string;
  state: string;
  description: string;
  ip_address: string;
  name: string;
  listen_port: number;
  count_peers: number;
  server: WireguardServer;
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
  server: WireguardServer;
};

export type InterfacePeerClient = {
  uuid: string;
  description: string;
  dns1: string;
  dns2: string;
  name: string;
};

export type InterfacePeer = {
  uuid_pk: string;
  name: string;
  last_online: Date;
  ip_address: string;
  client: InterfacePeerClient;
};

export type IpTableRules = {
  on_up: string[];
  on_down: string[];
};

const apiWithTag = api.enhanceEndpoints({
  addTagTypes: ['Interfaces'],
});

export const wireguardApi = apiWithTag.injectEndpoints({
  endpoints: (builder) => ({
    getWireguardInterfaces: builder.query<WireguardNetworkInterface[], void>({
      query: () => ({ url: '/api/v1/wireguard/interfaces/', method: 'GET' }),
      providesTags: (result) =>
        // is result available?
        result
          ? // successful query
            [
              ...result.map(
                ({ uuid }) => ({ type: 'Interfaces', uuid } as const)
              ),
              { type: 'Interfaces', id: 'LIST' },
            ]
          : // an error occurred, but we still want to refetch this
            // query when `{ type: 'Posts', id: 'LIST' }` is invalidated
            [{ type: 'Interfaces', id: 'LIST' }],
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
    getIpTableRules: builder.query<
      IpTableRules,
      { name: string; gatewayInterface: string }
    >({
      query: ({ name, gatewayInterface }) => ({
        url: `/api/v1/wireguard/interfaces/generate_iptable_rules/`,
        method: 'GET',
        params: { name, gateway_interface: gatewayInterface },
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
      invalidatesTags: (result, error, id) => [{ type: 'Interfaces', id }],
    }),
    changeStatusWireguardInterface: builder.mutation<
      DetailWireguardInterface,
      { uuid: string; toStatus: string }
    >({
      query: ({ uuid, toStatus }) => ({
        url: `/api/v1/wireguard/interfaces/${uuid}/${toStatus}/`,
        method: 'POST',
      }),
      async onQueryStarted({ uuid }, { dispatch, queryFulfilled }) {
        try {
          const { data: updatedPost } = await queryFulfilled;
          dispatch(
            wireguardApi.util.updateQueryData(
              'getDetailWireguardInterface',
              uuid,
              (draft) => {
                Object.assign(draft, updatedPost);
              }
            )
          );
        } catch {
          /* empty */
        }
      },
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
  useGetIpTableRulesQuery,
} = wireguardApi;
