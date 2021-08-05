#!/usr/bin/env python3
# -*- coding: utf-8 -*-

__version__ = '0.1.0'


# INSERT IN TO HW MODULE POSITION VIEW -> NOT USER ANY MORE
# TODO: REMOVE UNNECESSARY CODE
query_str_detect = """
INSERT INTO hw_module_position_view
(traceable_object_id, hw_module_id, position, raw_nmea,
 meta_information, show_on_map, active, deleted, created_on, updated_on, record_time)
SELECT hm.traceable_object_id,
       hm.id,
       ST_SetSRID(ST_MakePoint(%s,%s), 4326), %s, %s,
    hm.show_on_map, TRUE, FALSE, now(), now(), now()
FROM public.hw_module AS hm
WHERE hm.module_id = %s
  AND hm.active IS TRUE
  AND hm.deleted IS FALSE
    RETURNING *;
"""

# INSERT IN TO HW MODULE USER POSITION VIEW
create_hw_module_user_position_element_query = """
INSERT INTO hw_module_user_position_view
(user_id, traceable_object_id, hw_module_id, position, raw_nmea,
 meta_information, show_on_map, active, deleted, created_on, updated_on, record_time)
SELECT hm.user_id,
       hm.traceable_object_id,
       hm.id,
       ST_SetSRID(ST_MakePoint(%s,%s), 4326), %s,
    %s, hm.show_on_map, TRUE, FALSE, now(), now(), now()
FROM public.hw_module AS hm
WHERE hm.module_id = %s
  AND hm.active IS TRUE
  AND hm.deleted IS FALSE
    RETURNING *;
"""

create_hw_module_user_position_element_query_new = """
INSERT INTO public.hw_module_user_position
(user_id, traceable_object_id, hw_module_id, position, raw_nmea,
 meta_information, show_on_map, active, deleted, created_on, updated_on, record_time)
SELECT hm.user_id,
       hm.traceable_object_id,
       hm.id,
       ST_SetSRID(ST_MakePoint(%s,%s), 4326), %s,
    %s, hm.show_on_map, TRUE, FALSE, now(), now(), now()
FROM public.hw_module AS hm
WHERE hm.module_id = %s
  AND hm.active IS TRUE
  AND hm.deleted IS FALSE
    RETURNING *;
"""

# TODO:  REMOVE UNUSED CODE
query_intersect = """
SELECT clc, command_value, proto_field, action_id FROM(
SELECT ST_Intersects(un.pos, un.area_dta) AS clc, un.command_value, un.proto_field, un.action_id
FROM (
         SELECT hac.geom AS area_dta, hac.command_value, pos.pos, hac.proto_field, hac.action_id
         FROM public.user_hw_action_collection AS hac
                  CROSS JOIN (
             SELECT hmp.position AS pos, hw_module_id
             FROM public.hw_module_user_position AS hmp
             WHERE hmp.id = %s) AS pos
         WHERE hac.action_id not in (2, 8)
         AND pos.hw_module_id = ANY(hac.hw_list)
     ) AS un
) as dta
WHERE dta.clc is TRUE;
"""

# TODO: REMOVE UNUSED QUERY
# query_find_command_for_device = """
# SELECT uhc.id          AS id,
#        uhc.proto_field AS proto_field,
#        uhc.field_type  as field_type,
#        uhc.value       as field_value,
#        uhc.ack_message as ack_message
# FROM public.user_hw_command AS uhc
# WHERE uhc.state = 'pending'
#   AND uhc.hw_module_id in (
#     SELECT id
#     from public.hw_module AS hm
#     WHERE hm.active IS TRUE
#       AND hm.deleted is FALSE
#       AND hm.module_id = %s
#
#     LIMIT 1
# )
# order by created_on asc
# LIMIT 1;
# """


query_find_alarm_on_for_device = """
SELECT hw.id as hw_id,
       hw.module_id as hw_module_id,
       hw.user_id as hw_user_id,
       hw.traceable_object_id as hw_traceable_object_id,
       alarm_start,alarm_pause_duration,coalesce(to_char((alarm_on_tme), 'YYYY-MM-DD"T"HH24:MI:SS'), NULL) AS alarm_on_tme
       FROM public.hw_module as hw
left join public.traceable_object as tb on hw.traceable_object_id=tb.id where 
tb.alarm_state=true and tb.alarm_pause_status!=true and hw.module_id= %s
LIMIT 1;
"""

query_find_end_location_for_device = """
SELECT %s,%s,%s,%s,%s,end_zone,id FROM location WHERE
 meta_information @> '{"modules": [%s]}' and end_zone=True 
 order by updated_on desc limit 1;
"""
create_vehicle_wise_rent_statics = """
INSERT INTO public.vehicle_wise_rent_statics
(trraceable_object_id, rent_datetime, rentminits, user_id, extended_time)
VALUES(%s,%s,%s,%s,%s)
    RETURNING *;
"""
update_trcable_object_alaram_rent_status="""
UPDATE public.traceable_object
	SET  alarm_on_tme=%s, alarm_state=False
	WHERE id = %s
"""
query_find_endlocation_device = """
SELECT loc.id          AS id,
       uhc.proto_field AS proto_field,
       uhc.field_type  as field_type,
       uhc.value       as field_value,
       uhc.ack_message as ack_message,
       uhc.date_from,
       uhc.date_to
FROM public.location AS loc
WHERE id = %s
  AND hm.active IS TRUE
order by created_on asc
LIMIT 1;
"""

query_change_command_state_for_device = """
UPDATE public.user_hw_command AS uhc
SET state = 'executed',
updated_on = now()
WHERE id = %s
  AND hw_module_id in (
    SELECT id
    from public.hw_module AS hm
    WHERE hm.active IS TRUE
      AND hm.deleted is FALSE
      AND hm.module_id = %s
    LIMIT 1
)
RETURNING *
"""

check_collision_avoidance_system_query = """
SELECT tob.collision_avoidance_system AS collision_avoidance_system,
       hm.traceable_object_id         AS traceable_object_id,
       hm.id                          AS hw_module_id,
       hm.module_id                   AS hw_module_module_id
FROM public.traceable_object AS tob
         LEFT OUTER JOIN public.hw_module AS hm ON tob.id = hm.traceable_object_id
WHERE hm.module_id = %s
"""

# INSERT OD UPDATE CAS TABLE TODO: REMOVE
# upsert_collision_avoidance_system_last_point_query = """
# INSERT INTO hw_cas (
#     hw_module_id, position, record_time, active, deleted, created_on, updated_on) VALUES (
#     %s,  ST_SetSRID(ST_MakePoint(%s,%s), 4326), %s, True, False, now(), now())
# ON CONFLICT(hw_module_id) DO UPDATE SET position=  ST_SetSRID(ST_MakePoint(%s,%s), 4326),
#  record_time = %s, updated_on = now();
# """

# INSERT OD UPDATE CAS TABLE
upsert_collision_avoidance_system_last_point_query = """
INSERT INTO hw_cas (
    hw_module_id, position, record_time, active, deleted, created_on, updated_on)
    (SELECT hm.id , ST_SetSRID(ST_MakePoint(%s,%s), 4326), %s, True, False, now(), now() FROM public.hw_module as hm
    WHERE hm.module_id = %s)
  ON CONFLICT(hw_module_id) DO UPDATE SET position= ST_SetSRID(ST_MakePoint(%s,%s), 4326),
 record_time = %s, updated_on = now() RETURNING *;
"""

# TODO: CURRENTLY UNUSED REMOVE IN PRODUCTION
get_low_speed_on_poly_intersect_query = """
SELECT min(fin.command_value) FROM (
SELECT ST_Intersects(un.pos, un.area_dta), un.command_value
FROM (
         SELECT hac.geom AS area_dta, hac.command_value, pos
         FROM public.user_hw_action_collection AS hac
                  CROSS JOIN (
             SELECT hmp.position AS pos
             FROM public.hw_module_user_position AS hmp
             LEFT OUTER JOIN hw_module AS hm ON hm.id = hmp.hw_module_id
             WHERE hm.module_id = %s
             ORDER BY record_time DESC LIMIT 1
                      ) AS pos
     ) AS un
) as fin
WHERE fin.st_intersects IS TRUE;
"""
# GET CALCULATED THROTTLE VALUE
get_throttle_value_for_hw_module_module_id_query = """
SELECT * FROM get_throttle_value(%s, %s, %s, %s);
"""

create_hw_command_element_query = """
INSERT INTO public.user_hw_command
(user_id, hw_action_id, hw_module_id, proto_field, field_type,
 value, active, deleted, created_on, updated_on,
 ack_message, state, date_from, date_to, traceable_object_id)
SELECT hm.user_id,
       8,
       hm.id,
       'throttle',
       'bool',
       %s,
       TRUE,
       FALSE,
       now(),
       now(),
       True,
       'pending',
       now(),
       now(),
       hm.traceable_object_id
FROM public.hw_module AS hm
WHERE hm.module_id = %s
  AND hm.active IS TRUE
  AND hm.deleted IS FALSE
    RETURNING *;
"""

create_hw_command_element_on_intersect_query = """
INSERT INTO public.user_hw_command
(user_id, hw_action_id, hw_module_id, proto_field, field_type,
 value, active, deleted, created_on, updated_on,
 ack_message, state, date_from, date_to, traceable_object_id)
SELECT hm.user_id,
       %s,
       hm.id,
       %s,
       'bool',
       %s,
       TRUE,
       FALSE,
       now(),
       now(),
       True,
       'pending',
       now(),
       now(),
       hm.traceable_object_id
FROM public.hw_module AS hm
WHERE hm.module_id = %s
  AND hm.active IS TRUE
  AND hm.deleted IS FALSE
    RETURNING *;
"""


last_device_lock_state_query = """
SELECT uhc.value FROM public.user_hw_command AS uhc
LEFT OUTER JOIN public.hw_module AS hm ON uhc.hw_module_id = hm.id
WHERE uhc.state = 'executed' AND uhc.hw_action_id = 5
AND hm.module_id = %s
ORDER BY uhc.updated_on DESC
LIMIT 1;
"""