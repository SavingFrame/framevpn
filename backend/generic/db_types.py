from ipaddress import ip_address, ip_network

from sqlalchemy import TypeDecorator
from sqlalchemy.dialects import postgresql


class IPNetwork(TypeDecorator):
    impl = postgresql.INET

    def process_bind_param(self, value, dialect):
        if value is not None:
            return str(value)

    def process_result_value(self, value, dialect):
        return ip_network(value)


class IPAddress(TypeDecorator):
    impl = postgresql.INET

    def process_bind_param(self, value, dialect):
        print(value, dialect)
        if value is not None:
            return str(value)

    def process_result_value(self, value, dialect):
        return ip_address(value)
