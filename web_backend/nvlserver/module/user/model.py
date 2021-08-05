#!/usr/bin/env python3
# -*- coding: utf-8 -*-

__version__ = '1.0.1'

from web_backend.nvlserver.module import nvl_meta
from sqlalchemy import BigInteger, String, Column, Boolean, ForeignKey, DateTime, Table
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.sql.functions import func


user = Table(
    'user',
    nvl_meta,
    Column('id', BigInteger, primary_key=True),
    Column('email', String(255), nullable=False),
    Column('password', String(128), nullable=False),
    Column('fullname', String(70), nullable=False, default=''),
    Column('locked', Boolean, default=False, nullable=False),
    Column('language_id', BigInteger, ForeignKey('language.id'), nullable=False),
    Column('meta_information', JSONB, default=lambda: {"timezone": "Europe/Zagreb"}, nullable=False),
    Column('account_type_id', BigInteger, ForeignKey('account_type.id'), nullable=False),
    Column('active', Boolean, default=True, nullable=False),
    Column('deleted', Boolean, default=False, nullable=False),
    Column('created_on', DateTime(timezone=True), server_default=func.now(), nullable=False),
    Column('updated_on', DateTime(timezone=True),
           server_default=func.now(), onupdate=func.now(), nullable=False),
    Column('gendar', String(50), nullable=False),
    Column('companyName', String(200), nullable=False),
    Column('address', String(200), nullable=False),
    Column('city', String(50), nullable=False),
    Column('postalCode', String(20), nullable=False),
    Column('mobileNumber', String(15), nullable=False),
    Column('country', String(20), nullable=False),
    Column('webPage', String(15), nullable=False),
    Column('updateByMails', String(15), nullable=False),
    Column('vatId', String(40), nullable=False),
    Column('distance_unit', String(100), nullable=True),
)
