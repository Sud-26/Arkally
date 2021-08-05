#!/usr/bin/env python3
# -*- coding: utf-8 -*-

__version__ = '1.0.1'

create_traceable_object_element_query = """
INSERT INTO public.traceable_object AS tob
(user_id, name, traceable_object_type_id, note, meta_information,
 show_on_map, action, collision_avoidance_system, active, deleted)
VALUES
($1, $2, $3, $4, $5, $6, $7, $8, $9, FALSE) RETURNING *;
"""


create_vehicle_wise_rent_statics_query = """
INSERT INTO public.vehicle_wise_rent_statics AS tob
(trraceable_object_id, rent_datetime, rentminits, user_id, extended_time, alarm_pause_duration, end_time, total_duration, active_duration)
VALUES
($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *;
"""

create_vehicle_timer_time_slots_query = """
INSERT INTO public.vehicle_timer_time_slots AS vtts
(user_id, trraceable_object_id, slots, datetime)
VALUES
($1, $2, $3, $4) RETURNING *;
"""