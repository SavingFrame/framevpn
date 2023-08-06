import { api } from '../core/store/api';

interface ConfigSchema {
  wg_bin: string;
  wg_quick_bin: string;
  iptables_bin: string;
  wg_endpoint: string;
  is_configured?: boolean;
  server_name: string;
}

const apiWithTag = api.enhanceEndpoints({
  addTagTypes: ['Config'],
});

export const initialSetupApi = apiWithTag.injectEndpoints({
  endpoints: (builder) => ({
    getConfig: builder.query<ConfigSchema, void>({
      query: () => ({
        url: '/api/v1/config/',
        method: 'GET',
      }),
      providesTags: ['Config'],
    }),
    setConfig: builder.mutation<ConfigSchema, ConfigSchema>({
      query: (body) => ({
        url: '/api/v1/config/',
        method: 'POST',
        data: body,
      }),
    }),
  }),
});

export const { useGetConfigQuery, useSetConfigMutation } = initialSetupApi;
