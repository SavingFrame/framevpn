from typing import List

import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import INET, ARRAY
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.orm import Mapped, mapped_column, relationship, object_session

from config import settings
from database import Base
from generic.db_types import IPNetwork


class WireguardInterface(Base):
    __tablename__ = 'wireguard_interface'

    uuid = sa.Column(sa.UUID, primary_key=True, index=True, server_default=sa.text("gen_random_uuid()"))
    gateway_interface = sa.Column(sa.String, default='eth0')
    description = sa.Column(sa.String, default='')
    ip_address = sa.Column(IPNetwork)
    listen_port = sa.Column(sa.Integer)
    name = sa.Column(sa.String(125), unique=True)
    on_up = sa.Column(ARRAY(sa.String), default=list)
    on_down = sa.Column(ARRAY(sa.String), default=list)
    peers: Mapped[List["WireguardInterfacePeer"]] = relationship(back_populates='interface', lazy='select')
    private_key = sa.Column(sa.String)
    public_key = sa.Column(sa.String)

    @hybrid_property
    def count_peers(self):
        return object_session(self).query(WireguardInterfacePeer).with_parent(self).count()

    @hybrid_property
    def state(self):
        from wireguard.services.wireguard import WireguardService
        return WireguardService.get_wg_interface_status(self.name)

    @hybrid_property
    def filepath(self):
        return settings.BASE_DIR.joinpath('data', 'interfaces', f'{self.name}.conf')


class WireguardInterfacePeer(Base):
    __tablename__ = 'wireguard_interface_peer'

    uuid = sa.Column(sa.UUID, primary_key=True, index=True, server_default=sa.text("gen_random_uuid()"))
    interface_id: Mapped[int] = mapped_column(sa.ForeignKey('wireguard_interface.uuid'))
    interface: Mapped['WireguardInterface'] = relationship(back_populates='peers')
    description = sa.Column(sa.String)
    dns1 = sa.Column(INET, default='')
    dns2 = sa.Column(INET, default='')
    name = sa.Column(sa.String)
    private_key = sa.Column(sa.String)
    public_key = sa.Column(sa.String)

    @hybrid_property
    def state(self):
        return 'Unknown'  # TODO
