# Generated by the protocol buffer compiler.  DO NOT EDIT!
# source: NVLGPSStatus.proto

import sys
_b=sys.version_info[0]<3 and (lambda x:x) or (lambda x:x.encode('latin1'))
from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from google.protobuf import reflection as _reflection
from google.protobuf import symbol_database as _symbol_database
# @@protoc_insertion_point(imports)

_sym_db = _symbol_database.Default()




DESCRIPTOR = _descriptor.FileDescriptor(
  name='NVLGPSStatus.proto',
  package='',
  syntax='proto2',
  serialized_options=None,
  serialized_pb=_b('\n\x12NVLGPSStatus.proto\"\x8d\x03\n\x0cNVLGPSStatus\x12\x12\n\ntracker_id\x18\x01 \x02(\x0c\x12\x12\n\ngps_active\x18\x02 \x02(\x08\x12\x10\n\x08\x64\x61te_day\x18\x03 \x01(\x05\x12\x12\n\ndate_month\x18\x04 \x01(\x05\x12\x11\n\tdate_year\x18\x05 \x01(\x05\x12\x12\n\ntime_hours\x18\x06 \x01(\x05\x12\x14\n\x0ctime_minutes\x18\x07 \x01(\x05\x12\x14\n\x0ctime_seconds\x18\x08 \x01(\x05\x12\x19\n\x11time_microseconds\x18\t \x01(\x05\x12\x10\n\x08latitude\x18\n \x01(\x01\x12\x11\n\tlongitude\x18\x0b \x01(\x01\x12\x1f\n\x17speed_over_ground_knots\x18\x0c \x01(\x02\x12\x1b\n\x13track_angle_degrees\x18\r \x01(\x02\x12\x1a\n\x12magnetic_variation\x18\x0e \x01(\x02\x12\x12\n\nfuel_level\x18\x0f \x01(\x05\x12\x15\n\rvoltage_level\x18\x10 \x01(\x02\x12\x17\n\x0fvehicle_running\x18\x11 \x01(\x08')
)




_NVLGPSSTATUS = _descriptor.Descriptor(
  name='NVLGPSStatus',
  full_name='NVLGPSStatus',
  filename=None,
  file=DESCRIPTOR,
  containing_type=None,
  fields=[
    _descriptor.FieldDescriptor(
      name='tracker_id', full_name='NVLGPSStatus.tracker_id', index=0,
      number=1, type=12, cpp_type=9, label=2,
      has_default_value=False, default_value=_b(""),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR),
    _descriptor.FieldDescriptor(
      name='gps_active', full_name='NVLGPSStatus.gps_active', index=1,
      number=2, type=8, cpp_type=7, label=2,
      has_default_value=False, default_value=False,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR),
    _descriptor.FieldDescriptor(
      name='date_day', full_name='NVLGPSStatus.date_day', index=2,
      number=3, type=5, cpp_type=1, label=1,
      has_default_value=False, default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR),
    _descriptor.FieldDescriptor(
      name='date_month', full_name='NVLGPSStatus.date_month', index=3,
      number=4, type=5, cpp_type=1, label=1,
      has_default_value=False, default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR),
    _descriptor.FieldDescriptor(
      name='date_year', full_name='NVLGPSStatus.date_year', index=4,
      number=5, type=5, cpp_type=1, label=1,
      has_default_value=False, default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR),
    _descriptor.FieldDescriptor(
      name='time_hours', full_name='NVLGPSStatus.time_hours', index=5,
      number=6, type=5, cpp_type=1, label=1,
      has_default_value=False, default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR),
    _descriptor.FieldDescriptor(
      name='time_minutes', full_name='NVLGPSStatus.time_minutes', index=6,
      number=7, type=5, cpp_type=1, label=1,
      has_default_value=False, default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR),
    _descriptor.FieldDescriptor(
      name='time_seconds', full_name='NVLGPSStatus.time_seconds', index=7,
      number=8, type=5, cpp_type=1, label=1,
      has_default_value=False, default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR),
    _descriptor.FieldDescriptor(
      name='time_microseconds', full_name='NVLGPSStatus.time_microseconds', index=8,
      number=9, type=5, cpp_type=1, label=1,
      has_default_value=False, default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR),
    _descriptor.FieldDescriptor(
      name='latitude', full_name='NVLGPSStatus.latitude', index=9,
      number=10, type=1, cpp_type=5, label=1,
      has_default_value=False, default_value=float(0),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR),
    _descriptor.FieldDescriptor(
      name='longitude', full_name='NVLGPSStatus.longitude', index=10,
      number=11, type=1, cpp_type=5, label=1,
      has_default_value=False, default_value=float(0),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR),
    _descriptor.FieldDescriptor(
      name='speed_over_ground_knots', full_name='NVLGPSStatus.speed_over_ground_knots', index=11,
      number=12, type=2, cpp_type=6, label=1,
      has_default_value=False, default_value=float(0),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR),
    _descriptor.FieldDescriptor(
      name='track_angle_degrees', full_name='NVLGPSStatus.track_angle_degrees', index=12,
      number=13, type=2, cpp_type=6, label=1,
      has_default_value=False, default_value=float(0),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR),
    _descriptor.FieldDescriptor(
      name='magnetic_variation', full_name='NVLGPSStatus.magnetic_variation', index=13,
      number=14, type=2, cpp_type=6, label=1,
      has_default_value=False, default_value=float(0),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR),
    _descriptor.FieldDescriptor(
      name='fuel_level', full_name='NVLGPSStatus.fuel_level', index=14,
      number=15, type=5, cpp_type=1, label=1,
      has_default_value=False, default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR),
    _descriptor.FieldDescriptor(
      name='voltage_level', full_name='NVLGPSStatus.voltage_level', index=15,
      number=16, type=2, cpp_type=6, label=1,
      has_default_value=False, default_value=float(0),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR),
    _descriptor.FieldDescriptor(
      name='vehicle_running', full_name='NVLGPSStatus.vehicle_running', index=16,
      number=17, type=8, cpp_type=7, label=1,
      has_default_value=False, default_value=False,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR),
  ],
  extensions=[
  ],
  nested_types=[],
  enum_types=[
  ],
  serialized_options=None,
  is_extendable=False,
  syntax='proto2',
  extension_ranges=[],
  oneofs=[
  ],
  serialized_start=23,
  serialized_end=420,
)

DESCRIPTOR.message_types_by_name['NVLGPSStatus'] = _NVLGPSSTATUS
_sym_db.RegisterFileDescriptor(DESCRIPTOR)

NVLGPSStatus = _reflection.GeneratedProtocolMessageType('NVLGPSStatus', (_message.Message,), dict(
  DESCRIPTOR = _NVLGPSSTATUS,
  __module__ = 'NVLGPSStatus_pb2'
  # @@protoc_insertion_point(class_scope:NVLGPSStatus)
  ))
_sym_db.RegisterMessage(NVLGPSStatus)


# @@protoc_insertion_point(module_scope)
