import codecs
from cryptography.hazmat.primitives.asymmetric.x25519 import X25519PrivateKey
from cryptography.hazmat.primitives import serialization


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
