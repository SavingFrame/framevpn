from pyroute2 import IPDB


def get_wg_default_endpoint():
    with IPDB() as ipdb:
        return ipdb.interfaces[ipdb.routes['default']['oif']].ipaddr[0]['address']