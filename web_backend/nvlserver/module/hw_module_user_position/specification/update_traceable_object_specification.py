#!/usr/bin/env python3
# -*- coding: utf-8 -*-

__version__ = '1.0.1'

update_traceable_object_element_query = """
UPDATE public.traceable_object AS tob
SET name                       = $3,
    traceable_object_type_id   = $4,
    user_id                    = $1,
    note                       = $5,
    meta_information           = $6,
    show_on_map                = $7,
    action                     = $8,
    collision_avoidance_system = $9,
    active                     = $10
WHERE ($1::BIGINT is NULL OR tob.user_id = $1::BIGINT)
  AND tob.id = $2::BIGINT
RETURNING *;
 """

update_traceable_object_alram_time_element_query = """
UPDATE public.traceable_object AS tob
SET alarm_start                   = $2,
alarm_on_tme                      = $3,
alarm_state                       = $4,
alarm_pause_duration              = 0,
alarm_pause_status                = false,
alarm_pause_time                  = NULL
WHERE  tob.id = $1::BIGINT
RETURNING *;
 """

update_traceable_object_alram_status_query = """
UPDATE public.traceable_object AS tob
SET alarm_pause_status          = $2,
alarm_pause_time                = $3,
alarm_pause_duration            = $4
WHERE  tob.id = $1::BIGINT
RETURNING *;
 """