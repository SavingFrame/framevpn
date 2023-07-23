import os

from pyroute2 import WireGuard, NetlinkError, NDB

from database import SessionLocal
from generic.command import WgQuickCommand
from generic.errors import WireguardError
from wireguard.models import WireguardInterface
from wireguard.schemas import CreateWireguardInterfaceSchema
from wireguard.utils import generate_wg_private_key, generate_wg_public_key

wg = WireGuard()


class WireguardService:

    @classmethod
    def get_wg_interface_status(cls, iface: str):
        try:
            wg.info(iface)
            return 'UP'
        except NetlinkError as err:
            if err.code == 19:
                return 'Interface not found'
            return str(err)

    @classmethod
    def is_wg_iface_up(cls, iface: str) -> bool:
        return cls.get_wg_interface_status(iface) == 'UP'

    @classmethod
    def is_wg_iface_down(cls, iface: str) -> bool:
        return not cls.is_wg_iface_up(iface)

    @classmethod
    def create_wg_interface(cls, data: CreateWireguardInterfaceSchema, db: SessionLocal) -> WireguardInterface:
        private_key_klass, private_key_b64 = generate_wg_private_key()
        public_key = generate_wg_public_key(private_key_klass)
        wg_instance = WireguardInterface(
            **data.dict(),
            private_key=private_key_b64,
            public_key=public_key
        )
        db.add(wg_instance)
        db.commit()
        cls.generate_wg_config(wg_interface=wg_instance)
        return wg_instance

    @classmethod
    def delete_wg_interface(cls, wg_interface: WireguardInterface, db: SessionLocal):
        try:
            cls.down_wg_interface(wg_interface=wg_interface)
        except WireguardError:
            pass
        if os.path.exists(wg_interface.filepath):
            os.remove(wg_interface.filepath)
        db.delete(wg_interface)
        db.commit()

    @classmethod
    def up_wg_interface(cls, wg_interface: WireguardInterface):
        if cls.is_wg_iface_up(wg_interface.name):
            raise WireguardError(status_code=400, detail='Wireguard interface already up')
        result = WgQuickCommand(f'up {wg_interface.filepath}').run()
        if not result.successful:
            raise WireguardError(400, detail=result.err)
        return True

    @classmethod
    def down_wg_interface(cls, wg_interface: WireguardInterface):
        if cls.is_wg_iface_down(wg_interface.name):
            raise WireguardError(status_code=400, detail='Wireguard interface already down')
        result = WgQuickCommand(f'down {wg_interface.filepath}').run()
        if not result.successful:
            raise WireguardError(status_code=400, detail=result.err)
        return True

    @classmethod
    def generate_wg_config(cls, wg_interface: WireguardInterface):
        wg_config = [
            '[Interface]\n',
            f'PrivateKey = {wg_interface.private_key}\n',
            f'Address = {wg_interface.ip_address}\n',
            f'ListenPort = {wg_interface.listen_port}\n',
        ]
        wg_config.extend([f'PostUp = {command}]\n' for command in wg_interface.on_up])
        wg_config.extend([f'PostDown = {command}\n' for command in wg_interface.on_down])
        filepath = cls._save_config(wg_config, wg_interface)
        return filepath

    @classmethod
    def _save_config(cls, wg_config: list[str], wg_interface: WireguardInterface):
        filepath = wg_interface.filepath
        os.makedirs(filepath.parent, exist_ok=True)
        with open(filepath, 'w') as file:
            file.writelines(wg_config)
        return filepath
