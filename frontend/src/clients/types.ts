export interface ListResponse<T> {
  total: number;
  page: number;
  size: number;
  pages: number;
  items: T[];
}

export interface ListInterfacesInClientList {
  uuid: string;
  name: string;
}

export interface ListClient {
  uuid: string;
  description: string;
  dns1: string;
  dns2: string;
  name: string;
  interfaces: ListInterfacesInClientList[];
}

export interface DetailClient {
  uuid: string;
  description: string;
  dns1: string;
  dns2: string;
  name: string;
}

export interface CreateClient {
  description: string;
  dns1: string;
  dns2: string;
  name: string;
  interfaces: string[];
}

export interface ListInterfacesInClientDetail {
  uuid: string;
  name: string;
  ip_address: string;
}

export interface ListPeersInClientDetail {
  last_online: string;
  client_id: string;
  interface: ListInterfacesInClientDetail;
  ip_address: string | null;
}
