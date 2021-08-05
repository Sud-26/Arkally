#!/usr/bin/env python3
# -*- coding: utf-8 -*-

__version__ = '1.0.1'
update_subscription_element_query = """
UPDATE public.subscription AS sub
SET 
    user_id               = $2,
    subscription_model_id = $3,
    hw_module_id          = $4,   
    unit_count            = $5,
    date_from             = $6,
    date_to               = $7,
    active                = $8
WHERE sub.id = $1::BIGINT
RETURNING *;
 """

update_expir_subscription_element_query = """
UPDATE public.hw_module AS sub
SET 
    active               = $2,
    updated_on           = $3    
WHERE sub.id = $1::BIGINT
RETURNING *;
"""