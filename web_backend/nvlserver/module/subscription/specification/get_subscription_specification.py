#!/usr/bin/env python3
# -*- coding: utf-8 -*-

__version__ = '1.0.1'

get_subscription_list_query = """
SELECT sub.id                                    AS id,
       sub.subscription_uuid::VARCHAR            AS subscription_uuid,
       sub.user_id                               AS user_id,
       sub.hw_module_id                          AS hw_module_id,
       hwm.name                                  AS hw_mname,
       usr.fullname                              AS user_fullname,
       sub.subscription_model_id                 AS subscription_model_id,
       subm.description                          AS subscription_model_description,
       sub.rebate_id                             AS rebate_id,
       coalesce(reb.rebate_is_fixed, FALSE)      AS rebate_is_fixed,
       coalesce(reb.value, 0)::NUMERIC           AS rebate_value,
       sub.meta_information::json                AS meta_information,
       sub.unit_count                            AS unit_count,
       coalesce(to_char((sub.date_from), 'YYYY-MM-DD HH24:MI:SS'), NULL)      AS date_from_format,
       sub.date_from                             AS date_from,
       coalesce(to_char((sub.date_to), 'YYYY-MM-DD HH24:MI:SS'), NULL)      AS date_to_format,
       sub.date_to                               AS date_to,
       sub.active                                AS active,
       sub.deleted                               AS deleted,
       (select traceable_object.name from traceable_object where id=hwm.traceable_object_id) as vehicles
FROM public.subscription AS sub
         LEFT OUTER JOIN public.subscription_model AS subm ON subm.id = sub.subscription_model_id
         LEFT OUTER JOIN public.user AS usr ON usr.id = sub.user_id
         LEFT OUTER JOIN public.rebate AS reb ON reb.id = sub.rebate_id         
         LEFT OUTER JOIN public.hw_module AS hwm ON hwm.id = sub.hw_module_id
WHERE sub.deleted is FALSE
AND (
      $1::VARCHAR is NULL OR
      subm.description::VARCHAR ILIKE $1::VARCHAR || '%' OR
      subm.description::VARCHAR ILIKE '%' || $1::VARCHAR || '%' OR
      subm.description::VARCHAR ILIKE $1::VARCHAR || '%')
  AND ($3::BIGINT = 0 OR sub.user_id = $3::BIGINT)
  AND ($2::VARCHAR is NULL OR sub.subscription_model_id = $2::BIGINT)
  AND ($4::BIGINT = 0 OR hwm.user_id = $4::BIGINT)
"""

get_subscription_list_count_query = """
SELECT count(*) AS subscription_count
FROM public.subscription AS sub
         LEFT OUTER JOIN public.subscription_model AS subm ON subm.id = sub.subscription_model_id
         LEFT OUTER JOIN public.user AS usr ON usr.id = sub.user_id
         LEFT OUTER JOIN public.rebate AS reb ON reb.id = sub.rebate_id
         LEFT OUTER JOIN public.hw_module AS hwm ON hwm.id = sub.hw_module_id
WHERE sub.deleted is FALSE
 AND (
      $1::VARCHAR is NULL OR
      subm.description::VARCHAR ILIKE $1::VARCHAR || '%' OR
      subm.description::VARCHAR ILIKE '%' || $1::VARCHAR || '%' OR
      subm.description::VARCHAR ILIKE $1::VARCHAR || '%')
  AND ($3::BIGINT = 0 OR sub.user_id = $3::BIGINT)
  AND ($2::VARCHAR is NULL OR sub.subscription_model_id = $2::BIGINT)
  AND ($4::BIGINT = 0 OR hwm.user_id = $4::BIGINT)
"""

get_subscription_element_query = """
SELECT sub.id                                    AS id,
       sub.subscription_uuid::VARCHAR            AS subscription_id,
       sub.user_id                               AS user_id,
       sub.hw_module_id                          AS hw_module_id,
       hwm.name                                  AS hw_mname,
       usr.fullname                              AS user_fullname,
       sub.subscription_model_id                 AS subscription_model_id,
       subm.description                          AS subscription_model_description,
       sub.rebate_id                             AS rebate_id,
       coalesce(reb.rebate_is_fixed, FALSE)      AS rebate_is_fixed,
       coalesce(reb.value, 0)::NUMERIC           AS rebate_value,
       sub.meta_information::json                AS meta_information,
       sub.unit_count                            AS unit_count,
       sub.date_from                             AS date_from,
       sub.date_to                               AS date_to,
       sub.active                                AS active,
       sub.deleted                               AS deleted
FROM public.subscription AS sub
         LEFT OUTER JOIN public.subscription_model AS subm ON subm.id = sub.subscription_model_id
         LEFT OUTER JOIN public.user AS usr ON usr.id = sub.user_id
         LEFT OUTER JOIN public.rebate AS reb ON reb.id = sub.rebate_id
         LEFT OUTER JOIN public.hw_module AS hwm ON hwm.id = sub.hw_module_id
WHERE sub.deleted is FALSE
AND sub.id = $1;
"""
get_expir_subscription_element_query= """
SELECT id, hw_module_id	FROM public.subscription where date_to<$1;
"""