import { saveAs } from 'file-saver';
import { api } from '../core/store/api';
import {
  CreateClient,
  DetailClient,
  ListClient,
  ListPeersInClientDetail,
  ListResponse,
} from './types';
import { apiClient } from '../utils';

export const downloadClientConfig = async (
  uuid: string,
  filename: string
): Promise<void> => {
  const response = await apiClient.get(
    `api/v1/wireguard/clients/${uuid}/download_config/`,
    { responseType: 'text' }
  );
  if (response.status === 200) {
    const data = await response.data;
    const blob = new Blob([data], { type: 'text/plain' });
    saveAs(blob, filename);
    return;
  }
  throw new Error('Request failed');
};

const apiWithTag = api.enhanceEndpoints({
  addTagTypes: ['Clients', 'ClientPeers'],
});

export const clientApi = apiWithTag.injectEndpoints({
  endpoints: (builder) => ({
    getClients: builder.query<
      ListResponse<ListClient>,
      { size: number; page: number }
    >({
      query: ({ page = 1, size }) => ({
        url: `/api/v1/wireguard/clients/?page=${page}&size=${size}`,
        method: 'GET',
      }),
    }),
    getDetailClient: builder.query<DetailClient, string>({
      query: (uuid) => ({
        url: `/api/v1/wireguard/clients/${uuid}/`,
        method: 'GET',
      }),
    }),
    addClient: builder.mutation<DetailClient, CreateClient>({
      query: (body) => ({
        url: `/api/v1/wireguard/clients/`,
        method: 'POST',
        data: body,
      }),
    }),
    deleteClient: builder.mutation<void, string>({
      query: (uuid) => ({
        url: `/api/v1/wireguard/clients/${uuid}/`,
        method: 'DELETE',
      }),
    }),
    getClientPeers: builder.query<ListPeersInClientDetail[], string>({
      query: (uuid) => ({
        url: `/api/v1/wireguard/clients/${uuid}/peers/`,
        method: 'GET',
      }),
      providesTags: (result) =>
        // is result available?
        result
          ? // successful query
            [
              ...result.map(
                ({ client_id: clientId, interface: iface }) =>
                  ({
                    type: 'ClientPeers',
                    uuid: clientId + iface.uuid,
                  } as const)
              ),
              { type: 'ClientPeers', id: 'LIST' },
            ]
          : // an error occurred, but we still want to refetch this query when
            // `{ type: 'Posts', id: 'LIST' }` is invalidated
            [{ type: 'ClientPeers', id: 'LIST' }],
    }),
    getFreeIpAddress: builder.query<{ ip_address: string }, string>({
      query: (uuid) => ({
        url: `/api/v1/wireguard/interfaces/${uuid}/get_free_ip_address/`,
        method: 'GET',
      }),
    }),
    addClientPeer: builder.mutation<
      ListPeersInClientDetail,
      {
        clientId: string;
        interfaceId: string;
        ipAddress: string;
      }
    >({
      query: ({ clientId, interfaceId, ipAddress }) => ({
        url: `/api/v1/wireguard/clients/${clientId}/peers/`,
        method: 'POST',
        data: { interface_id: interfaceId, ip_address: ipAddress },
      }),
      invalidatesTags: (result, error, { clientId, interfaceId }) => [
        { type: 'ClientPeers', uuid: clientId + interfaceId },
      ],
    }),
    deleteClientPeer: builder.mutation<
      void,
      { clientId: string; interfaceId: string }
    >({
      query: ({ clientId, interfaceId }) => ({
        url: `/api/v1/wireguard/clients/${clientId}/peers/${interfaceId}/`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { clientId, interfaceId }) => [
        { type: 'ClientPeers', uuid: clientId + interfaceId },
      ],
    }),
  }),
});

export const {
  useGetClientsQuery,
  useAddClientMutation,
  useGetDetailClientQuery,
  useGetClientPeersQuery,
  useLazyGetFreeIpAddressQuery,
  useAddClientPeerMutation,
  useDeleteClientPeerMutation,
  useDeleteClientMutation,
} = clientApi;
