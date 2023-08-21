from pyroute2 import NDB


def get_wg_default_endpoint() -> str:
    with NDB() as ndb:
        try:
            return ndb.interfaces[ndb.routes['default']['oif']].ipaddr[0]['address']
        except KeyError:
            return ''
