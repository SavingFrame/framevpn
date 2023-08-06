import codecs
import ipaddress
import re
from typing import Optional

from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric.x25519 import X25519PrivateKey

from config import settings
from network.utils import get_wg_default_endpoint


# generate private key
def generate_wg_private_key() -> tuple[X25519PrivateKey, str]:
    private_key = X25519PrivateKey.generate()
    bytes_ = private_key.private_bytes(
        encoding=serialization.Encoding.Raw,
        format=serialization.PrivateFormat.Raw,
        encryption_algorithm=serialization.NoEncryption()
    )
    return private_key, codecs.encode(bytes_, 'base64').decode('utf8').strip()


# derive public key
def generate_wg_public_key(private_key: X25519PrivateKey) -> str:
    pubkey = private_key.public_key().public_bytes(
        encoding=serialization.Encoding.Raw,
        format=serialization.PublicFormat.Raw
    )
    return codecs.encode(pubkey, 'base64').decode('utf8').strip()


def find_first_free_ip(
    subnet: ipaddress.IPv4Network,
    ip_list: list[ipaddress.IPv4Address]
) -> Optional[ipaddress.IPv4Address]:
    for ip in subnet.hosts():
        if ip not in ip_list:
            return ip
    return None


def save_wireguard_endpoint_to_env():
    with open(settings.BASE_DIR.joinpath('.env'), 'r') as f:
        lines = f.read()
        if re.search(r'(^WG_ENDPOINT)(\=)(.*\n(?=[A-Z])|.*$)', lines, flags=re.MULTILINE):
            return
    with open(settings.BASE_DIR.joinpath('.env'), 'a') as f:
        f.write(f'\nWG_ENDPOINT={get_wg_default_endpoint()}\n')

