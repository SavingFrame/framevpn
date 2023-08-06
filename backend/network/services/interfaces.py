import ipaddress
from random import randint

from coolname import generate_slug
from faker import Faker
from faker.providers import internet
from pyroute2 import IPRoute, IPDB

from config import settings
from database import SessionLocal
from wireguard.models import WireguardInterface
from wireguard.utils import find_first_free_ip

ipr = IPRoute()
fake = Faker()
fake.add_provider(internet)


class NetworkInterfaceService:
    NAME_MAX_LENGTH = 15

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
                'mac_address': interface.get_attr('IFLA_ADDRESS')
            }
            response.append(interface_info)
        return response

    @classmethod
    def is_name_used(cls, name):
        for iface in ipr.get_links():
            if iface.get('IFLA_IFNAME') == name:
                return True
        return False

    @classmethod
    def generate_name(cls) -> str:
        name = generate_slug(2)[:cls.NAME_MAX_LENGTH]
        if cls.is_name_used(name):
            return cls.generate_name()
        return name

    @staticmethod
    def _generate_subnet():
        return ipaddress.IPv4Interface(f'{fake.ipv4_private()}/{randint(8, 30)}').network

    @classmethod
    def is_network_used(cls, interface: ipaddress.IPv4Network):
        for iface in cls.get_interfaces():
            if iface.get('ip_address') and interface in ipaddress.IPv4Interface(iface.get('ip_address')).network:
                return True
        return False

    @classmethod
    def generate_ipv4_subnet(cls) -> ipaddress.IPv4Network | None:
        ip = cls._generate_subnet()
        tries = 0
        max_tries = 100
        while tries < max_tries and cls.is_network_used(ip):
            ip = cls._generate_subnet()
        if tries >= max_tries:
            return None
        return ip

    @classmethod
    def generate_free_port(cls, db: SessionLocal) -> int | None:
        max_tries = 100
        for tries in range(0, max_tries):
            port = randint(settings.WG_MIN_PORT_NUMBER, settings.WG_MAX_PORT_NUMBER)
            q = db.query(WireguardInterface).filter(WireguardInterface.listen_port == port)
            if not db.query(q.exists()).scalar():
                return port
        return None

    @classmethod
    def get_default_gateway(cls) -> tuple[str | None, str | None]:
        routes = ipr.get_routes(table=254)  # Table 254 is the main table, where default routes are usually stored
        for route in routes:
            if route.get_attr('RTA_GATEWAY'):
                gateway = route.get_attr('RTA_GATEWAY')
                links = ipr.get_links(route.get_attr('RTA_OIF'))  # Fetch interface info using OIF (output interface)
                interface_name = links[0].get_attr('IFLA_IFNAME')  # Get the interface name
                return interface_name, gateway
        return None, None

    @classmethod
    def generate_iptables_rules(cls, name: str, gateway_name: str) -> tuple[list[str], list[str]]:
        on_up = [
            f'{settings.IPTABLES_BIN} -I FORWARD -i {name} -j ACCEPT',
            f'{settings.IPTABLES_BIN} -I FORWARD -o {name} -j ACCEPT',
            f'{settings.IPTABLES_BIN} -t nat -I POSTROUTING -o {gateway_name} -j MASQUERADE'
        ]
        on_down = [
            f'{settings.IPTABLES_BIN} -D FORWARD -i {name} -j ACCEPT',
            f'{settings.IPTABLES_BIN} -D FORWARD -o {name} -j ACCEPT',
            f'{settings.IPTABLES_BIN} -t nat -D POSTROUTING -o {gateway_name} -j MASQUERADE',
        ]
        return on_up, on_down

    @classmethod
    def get_free_ip_address(cls, interface_instance: WireguardInterface) -> ipaddress.IPv4Address | None:
        subnet = interface_instance.ip_address
        used_ips = [peer.ip_address for peer in interface_instance.peers]
        return find_first_free_ip(subnet, used_ips)
