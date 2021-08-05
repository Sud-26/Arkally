#!/usr/bin/env python3
# -*- coding: utf-8 -*-

__version__ = '1.0.1'

get_traceable_object_list_query = """
SELECT tob.id                                                             AS id,
       tob.name                                                           AS name,
       vtts.slots                                                          AS slots,
       tob.buzzer_on                                                      AS buzzer_on,
       tob.cron_status                                                    AS cron_status,
       tob.alarm_pause_duration                                           AS alarm_pause_duration,
       coalesce(to_char((tob.alarm_pause_time), 'YYYY-MM-DD HH24:MI:SS'), NULL)  AS alarm_pause_time,
       tob.alarm_pause_status                                             AS alarm_pause_status,
       coalesce(to_char((tob.alarm_on_tme), 'YYYY-MM-DD HH24:MI:SS'), NULL)      AS alarm_on_tme,
       tob.alarm_start                                       AS alarm_start,
       tob.alarm_state                                       As alarm_state,
       tob.traceable_object_type_id                                       AS traceable_object_type_id,
       tobt.name                                                          AS traceable_object_type_name,
       tob.user_id                                                        AS user_id,
       usr.fullname                                                       AS user_fullname,
       tob.note                                                           AS note,
       tob.show_on_map                                                    AS show_on_map,
       tob.action                                                         AS action,
       tob.collision_avoidance_system                                     AS collision_avoidance_system,
       coalesce(tob.meta_information ->> 'consumption', '')               AS consumption,
       coalesce(tob.meta_information ->> 'registration_number', '')       AS registration_number,
       coalesce(tob.meta_information ->> 'vin_number', '')                AS vin_number,
       coalesce((tob.meta_information ->> 'vehicle_brand_id')::INT, NULL) AS vehicle_brand_id,
       coalesce(tob.meta_information ->> 'vehicle_model', '')             AS vehicle_model,
       coalesce((tob.meta_information ->> 'vehicle_model_id')::INT, NULL) AS vehicle_model_id,
       coalesce(tob.meta_information ->> 'vehicle_year', '')              AS vehicle_year,
       coalesce(tob.meta_information ->> 'vehicle_default_throttle', '')  AS vehicle_default_throttle,
       (hmcs.meta_information->'action_list')::json AS                       action_list,
       tob.active                                                         AS active,
       tob.deleted                                                        AS deleted
FROM public.traceable_object AS tob
        LEFT OUTER JOIN public.hw_module_command_state AS hmcs ON hmcs.traceable_object_id = tob.id
        LEFT OUTER JOIN public.traceable_object_type AS tobt ON tobt.id = tob.traceable_object_type_id
        LEFT OUTER JOIN public.user AS usr ON usr.id = tob.user_id
        LEFT OUTER JOIN public.vehicle_timer_time_slots AS vtts ON vtts.user_id = tob.user_id and vtts.trraceable_object_id = tob.id
WHERE tob.deleted is FALSE
  AND ($1::BIGINT is NULL OR tob.user_id = $1::BIGINT)
    AND (
      $2::VARCHAR is NULL OR
      tob.name ILIKE $2::VARCHAR || '%' OR
      tob.name ILIKE '%' || $2::VARCHAR || '%' OR
      tob.name ILIKE $2::VARCHAR || '%')
"""

vehicle_wise_rent_statics_report_query = """
SELECT	
	trraceable_object_id,
	rentminits,
	name,
	COUNT (rentminits) as cnt
FROM
	public.vehicle_wise_rent_statics vtob
	LEFT OUTER JOIN public.traceable_object AS tob ON vtob.trraceable_object_id = tob.id
  WHERE  ($1::BIGINT = 0 OR tob.user_id = $1::BIGINT)    
    AND ($2::BIGINT = 0 OR  vtob.trraceable_object_id = $2::BIGINT)    
    AND ($3::timestamp is NULL OR  vtob.rent_datetime >= $3::timestamp)
    AND ($4::timestamp is NULL OR  vtob.end_time <= $4::timestamp)
GROUP BY	rentminits,trraceable_object_id,name	
"""

vehicle_wise_rent_statics_report_count_query = """
SELECT	
	COUNT (DISTINCT trraceable_object_id) as cnt
FROM
	public.vehicle_wise_rent_statics vtob
	LEFT OUTER JOIN public.traceable_object AS tob ON vtob.trraceable_object_id = tob.id
  WHERE  ($1::BIGINT = 0 OR tob.user_id = $1::BIGINT)    
    AND ($2::BIGINT = 0 OR  vtob.trraceable_object_id = $2::BIGINT)    
    AND ($3::timestamp is NULL OR  vtob.rent_datetime >= $3::timestamp)
    AND ($4::timestamp is NULL OR  vtob.end_time <= $4::timestamp)
	
"""

vehicle_wise_rent_statics_query = """
SELECT vtob.id                                                             AS id,
       tob.name                                                           AS name,
       vtob.alarm_pause_duration                                          AS alarm_pause_duration,
       vtob.total_duration                                                AS total_duration,
       vtob.active_duration                                               AS active_duration,
       coalesce(to_char((vtob.end_time), 'YYYY-MM-DD HH24:MI:SS'), NULL)  AS end_time,  
       vtob.extended_time                                                 AS extended_time,
       vtts.slots                                                         AS slots,
       tob.buzzer_on                                                      AS buzzer_on,       
       tob.alarm_pause_status                                             AS alarm_pause_status,
       coalesce(to_char((vtob.rent_datetime), 'YYYY-MM-DD HH24:MI:SS'), NULL)      AS rent_datetime,
       vtob.rentminits                                       AS rentminits,       
       tob.traceable_object_type_id                                       AS traceable_object_type_id,      
       tob.user_id                                                        AS user_id,
       usr.fullname                                                       AS user_fullname,
       tob.note                                                           AS note,
       tob.show_on_map                                                    AS show_on_map,
       tob.action                                                         AS action,
       tob.collision_avoidance_system                                     AS collision_avoidance_system,
       coalesce(tob.meta_information ->> 'consumption', '')               AS consumption,
       coalesce(tob.meta_information ->> 'registration_number', '')       AS registration_number,
       coalesce(tob.meta_information ->> 'vin_number', '')                AS vin_number,
       coalesce((tob.meta_information ->> 'vehicle_brand_id')::INT, NULL) AS vehicle_brand_id,
       coalesce(tob.meta_information ->> 'vehicle_model', '')             AS vehicle_model,
       coalesce((tob.meta_information ->> 'vehicle_model_id')::INT, NULL) AS vehicle_model_id,
       coalesce(tob.meta_information ->> 'vehicle_year', '')              AS vehicle_year,
       coalesce(tob.meta_information ->> 'vehicle_default_throttle', '')  AS vehicle_default_throttle,      
       tob.active                                                         AS active,
       tob.deleted                                                        AS deleted
FROM public.vehicle_wise_rent_statics AS vtob
        LEFT OUTER JOIN public.traceable_object AS tob ON vtob.trraceable_object_id = tob.id       
        LEFT OUTER JOIN public.user AS usr ON usr.id = vtob.user_id
        LEFT OUTER JOIN public.vehicle_timer_time_slots AS vtts ON vtts.user_id = tob.user_id and vtts.trraceable_object_id = tob.id
WHERE  ($1::BIGINT = 0 OR tob.user_id = $1::BIGINT)
    AND (
      $2::VARCHAR is NULL OR
      tob.name ILIKE $2::VARCHAR || '%' OR
      tob.name ILIKE '%' || $2::VARCHAR || '%' OR
      tob.name ILIKE $2::VARCHAR || '%')
    AND ($5::BIGINT = 0 OR  vtob.trraceable_object_id = $5::BIGINT)
    AND ($6::BIGINT = 0 OR  vtob.rentminits = $6::BIGINT)
    AND ($7::timestamp is NULL OR  vtob.rent_datetime >= $7::timestamp)
    AND ($8::timestamp is NULL OR  vtob.end_time <= $8::timestamp)
"""

get_vehicle_wise_rent_statics_count_query = """
SELECT count(*) AS get_vehicle_wise_rent_statics_count 
FROM public.vehicle_wise_rent_statics AS vtob
        LEFT OUTER JOIN public.traceable_object AS tob ON vtob.trraceable_object_id = tob.id       
        LEFT OUTER JOIN public.user AS usr ON usr.id = vtob.user_id
WHERE  ($1::BIGINT = 0 OR tob.user_id = $1::BIGINT)
    AND (
      $2::VARCHAR is NULL OR
      tob.name ILIKE $2::VARCHAR || '%' OR
      tob.name ILIKE '%' || $2::VARCHAR || '%' OR
      tob.name ILIKE $2::VARCHAR || '%')
    AND ($3::BIGINT = 0 OR  vtob.trraceable_object_id = $3::BIGINT)
    AND ($4::BIGINT = 0  OR  vtob.rentminits = $4::BIGINT)
    AND ($5::timestamp is NULL OR  vtob.rent_datetime >= $5::timestamp)
    AND ($6::timestamp is NULL OR  vtob.end_time <= $6::timestamp)
"""

get_traceable_object_list_dropdown_query = """
SELECT tob.id                       AS id,
       tob.name                     AS name
FROM public.traceable_object AS tob
WHERE tob.deleted is FALSE
  AND tob.active is TRUE
  AND ($1::BIGINT = 0 OR tob.user_id = $1::BIGINT)
  AND ($2::VARCHAR is NULL OR tob.name ILIKE $2::VARCHAR || '%')
"""


get_traceable_object_list_count_query = """
SELECT count(*) AS traceable_object_count
FROM public.traceable_object AS tob
        LEFT OUTER JOIN public.hw_module_command_state AS hmcs ON hmcs.traceable_object_id = tob.id
         LEFT OUTER JOIN public.traceable_object_type AS tobt ON tobt.id = tob.traceable_object_type_id
         LEFT OUTER JOIN public.user AS usr ON usr.id = tob.user_id
WHERE tob.deleted is FALSE
  AND tob.active is TRUE
  AND ($1::BIGINT is NULL OR tob.user_id = $1::BIGINT)
  AND (
      $2::VARCHAR is NULL OR
      tob.name ILIKE $2::VARCHAR || '%' OR
      tob.name ILIKE '%' || $2::VARCHAR || '%' OR
      tob.name ILIKE $2::VARCHAR || '%')
"""


get_traceable_object_element_query = """
SELECT tob.id                                                             AS id,
       tob.name                                                           AS name,
       tob.cron_status                                                    AS cron_status,
       tob.disable_engine_start                                           AS disable_engine_start,
       tob.stop_engine                                                    AS stop_engine,
       tob.buzzer_on                                                      AS buzzer_on,
       tob.alarm_pause_duration                                           AS alarm_pause_duration,
       tob.alarm_pause_status                                             AS alarm_pause_status,       
       coalesce(to_char((tob.alarm_pause_time), 'YYYY-MM-DD HH24:MI:SS'), NULL)  AS alarm_pause_time,
       vtts.slots                                                         AS slots,      
       coalesce(to_char((tob.alarm_on_tme), 'YYYY-MM-DD HH24:MI:SS'), NULL)      AS alarm_on_tme,
       tob.alarm_start                                       AS alarm_start,
       tob.alarm_state                                       As alarm_state, 
       tob.traceable_object_type_id                                       AS traceable_object_type_id,
       tobt.name                                                          AS traceable_object_type_name,
       tob.user_id                                                        AS user_id,
       usr.fullname                                                       AS user_fullname,
       tob.note                                                           AS note,
       tob.show_on_map                                                    AS show_on_map,
       tob.action                                                         AS action,
       tob.collision_avoidance_system                                     AS collision_avoidance_system,
       coalesce(tob.meta_information ->> 'consumption', '')               AS consumption,
       coalesce(tob.meta_information ->> 'registration_number', '')       AS registration_number,
       coalesce(tob.meta_information ->> 'vin_number', '')                AS vin_number,
       coalesce(tob.meta_information ->> 'vehicle_brand', '')             AS vehicle_brand,
       coalesce((tob.meta_information ->> 'vehicle_brand_id')::INT, NULL) AS vehicle_brand_id,
       coalesce(tob.meta_information ->> 'vehicle_model', '')             AS vehicle_model,
       coalesce((tob.meta_information ->> 'vehicle_model_id')::INT, NULL) AS vehicle_model_id,
       coalesce(tob.meta_information ->> 'vehicle_year', '')              AS vehicle_year,
       coalesce(tob.meta_information ->> 'vehicle_default_throttle', '')  AS vehicle_default_throttle,
       tob.active                                                         AS active,              
       tob.deleted                                                        AS deleted      
FROM public.traceable_object AS tob
         LEFT OUTER JOIN public.traceable_object_type AS tobt ON tobt.id = tob.traceable_object_type_id
         LEFT OUTER JOIN public.user AS usr ON usr.id = tob.user_id
         LEFT OUTER JOIN public.vehicle_timer_time_slots AS vtts ON vtts.user_id = tob.user_id and vtts.trraceable_object_id = tob.id
WHERE tob.deleted is FALSE
  -- AND tob.active is TRUE
    AND ($1::BIGINT is NULL OR tob.user_id = $1::BIGINT)
    AND tob.id = $2::BIGINT;
"""


get_traceable_object_element_by_name_query = """
SELECT tob.id                                                             AS id,
       tob.name                                                           AS name,
       vtts.slots                                                          AS slots,
       tob.buzzer_on                                                      AS buzzer_on,
       tob.alarm_pause_duration                                           AS alarm_pause_duration,
       tob.traceable_object_type_id                                       AS traceable_object_type_id,
       tob.alarm_pause_status                                             AS alarm_pause_status,
       tobt.name                                                          AS traceable_object_type_name,
       tob.user_id                                                        AS user_id,
       usr.fullname                                                       AS user_fullname,
       tob.note                                                           AS note,
       tob.show_on_map                                                    AS show_on_map,
       tob.action                                                         AS action,
       tob.collision_avoidance_system                                     AS collision_avoidance_system,
       coalesce(tob.meta_information ->> 'consumption', '')               AS consumption,
       coalesce(tob.meta_information ->> 'registration_number', '')       AS registration_number,
       coalesce(tob.meta_information ->> 'vin_number', '')                AS vin_number,
       coalesce(tob.meta_information ->> 'vehicle_brand', '')             AS vehicle_brand,
       coalesce((tob.meta_information ->> 'vehicle_brand_id')::INT, NULL) AS vehicle_brand_id,
       coalesce(tob.meta_information ->> 'vehicle_model', '')             AS vehicle_model,
       coalesce((tob.meta_information ->> 'vehicle_model_id')::INT, NULL) AS vehicle_model_id,
       coalesce(tob.meta_information ->> 'vehicle_year', '')              AS vehicle_year,
       coalesce(tob.meta_information ->> 'vehicle_default_throttle', '')  AS vehicle_default_throttle,
       tob.active                                                         AS active,
       tob.deleted                                                        AS deleted
FROM public.traceable_object AS tob
         LEFT OUTER JOIN public.traceable_object_type AS tobt ON tobt.id = tob.traceable_object_type_id
         LEFT OUTER JOIN public.user AS usr ON usr.id = tob.user_id
         LEFT OUTER JOIN public.vehicle_timer_time_slots AS vtts ON vtts.user_id = tob.user_id and vtts.trraceable_object_id = tob.id
WHERE tob.deleted is FALSE
  -- AND tob.active is TRUE
  AND ($1::BIGINT is NULL OR tob.user_id = $1::BIGINT)
    AND (
      $2::VARCHAR is NULL OR
      tob.name ILIKE $2::VARCHAR || '%' OR
      tob.name ILIKE '%' || $1::VARCHAR || '%' OR
      tob.name ILIKE $2::VARCHAR || '%')
    LIMIT 1;
"""
