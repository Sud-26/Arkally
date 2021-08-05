#!/usr/bin/env python3
# -*- coding: utf-8 -*-


import os

DEBUG = True

CONFIG_PATH = os.path.realpath(__file__)
ROOT_PATH = os.path.dirname(CONFIG_PATH)
TESTS_DIR = os.path.join(ROOT_PATH, 'tests')
LOG_DIR = os.path.join(ROOT_PATH, 'logs')
SUPPORT_DATA_DIRECTORY = os.path.join(ROOT_PATH, 'support_data')

if DEBUG is True:
    SALT = '$2b$12$Phiw.3RLnPfawQLCvR0OJO'
    DATABASE = {
        'type': 'postgresql',
        'host': '127.0.0.1',
        'user': 'thor_user',
        'port': '5432',
        'password': 'Th0rG3riPg2020!',
        'database': 'thorium_db'
    }
    REDIS = {
        'REDIS_HOST': '127.0.0.1',
        'REDIS_PORT': 6379,
        'REDIS_DATABASE': 15,
        'REDIS_SSL': None,
        'REDIS_ENCODING': None,
        'REDIS_MIN_SIZE_POOL': 1,
        'REDIS_MAX_SIZE_POOL': 10
    }
    PORT = 11223
    HOSTNAME = '127.0.0.1'
    API_HOSTNAME = '127.0.0.1:11223'
    REQUEST_TIMEOUT = 60
    REQUEST_MAX_SIZE = 100000
    # WORKERS = os.cpu_count()
    WORKERS = 1
    dsn = dict(
        database=DATABASE.get('database'),
        password=DATABASE.get('password'),
        user=DATABASE.get('user'),
        host=DATABASE.get('host'),
        port=DATABASE.get('port')
    )
    # DO NOT TOUCH THE CODE ABOVE
    DEFAULT_LOOP_TIMEOUT = 5
