from pyroute2 import NDB, IPRoute

ipr = IPRoute()


class NetworkInterfaceService:

    @staticmethod
    def _interface_state_to_bool(state) -> bool | None:
        converter = {'up': True, 'down': False}
        return converter.get(state)

    @classmethod
    def get_interfaces(cls):
        response = []
        for interface in ipr.get_links():
            address_object = ipr.get_addr(index=interface.get('index'))
            interface_info = {
                'id': interface.get('index'),
                'state': cls._interface_state_to_bool(interface.get('state')),
                'ip_address': address_object[0].get_attr('IFA_ADDRESS') if address_object else None,
                'name': interface.get_attr('IFLA_IFNAME'),
                'mac_address': interface.get_attr("IFLA_ADDRESS")
            }
            response.append(interface_info)
        return response
