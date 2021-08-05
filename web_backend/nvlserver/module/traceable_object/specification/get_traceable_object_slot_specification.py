#!/usr/bin/env python3
# -*- coding: utf-8 -*-

__version__ = '1.0.1'

get_traceable_object_slot_list_dropdown_query = """
SELECT tobb.id                       AS id,
       slots as slots
FROM public.vehicle_timer_time_slots AS tobb
"""
