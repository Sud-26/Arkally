#!/usr/bin/env python3
# -*- coding: utf-8 -*-

__version__ = '1.0.1'


create_user_element_query = """
INSERT INTO public."user" AS usr
(email, password, fullname, locked, language_id, meta_information,
 account_type_id, active, deleted)
VALUES
($1, $2, $3, $4, $5, $6, $7, $8, FALSE) RETURNING *;
"""

create_user_element_query_front = """
INSERT INTO public."user" AS usr
(email, password, fullname, locked, language_id, meta_information,
 account_type_id, active, gendar, companyName, address, city, postalcode, country, mobilenumber, webpage, updatebymails, vatid, deleted)
VALUES
($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, FALSE) RETURNING *;
"""