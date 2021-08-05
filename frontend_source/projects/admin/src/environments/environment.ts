export const environment = {
  production: true,
  storageKey: 'current-user',
  action_poll_interval: 2000,
  zoomLevel: {
    reportMarker: 13,
    mapGeography: 9,
    vehicle: 10,
  },

  api: {
    url: 'http://arkally.com/api',
    path: {
      authentication: 'auth',
      hw_modules: 'hw_module',
      hw_module_user_position: 'hw_module_user_position',
      console: 'console',
      vehicles: 'traceable_object',
      vehicle_wise_rent_statics: 'traceable_object/vehicle_wise_rent_statics',
      vehicle_wise_rent_statics_reports: 'traceable_object/vehicle_wise_rent_statics_report',
      command: 'traceable_object/create_command',
      updateCommand: 'traceable_object/updated_device_command',
      locations: 'location',
      support: 'support',
      subscription: 'subscription',
      rebate: 'subscription/rebate',
      user_management: 'user_management',
      createUserFront: 'user_management/create_user_front',
      update_password: 'user_management/update_password',
      update_map_pool_time: 'user_management/update_map_pool_time',
      update_timezone: 'user_management/update_timezone',
      forgotPassEmail: 'user_management/forgot_password_email',
      validateOtp: 'user_management/validate_otp',
      resetPassword: 'user_management/reset_password',
      emailVerification: 'user_management/email_verification',
      mailVerify: 'email-verify',
      report: 'nvl_report',
      trip_info: 'nvl_report/trip_info',
      rent: 'rent',
      alarm_list: "traceable_object/update_alram_time",
      alarm_pause_status: "traceable_object/update_alram_status",
      rentCompleted: "traceable_object/rent_completed",
      rentReset: "traceable_object/rent_reset",
      vehileTimeSlot: "traceable_object/update_vehicle_timeslots",
      soundBuzzerToggle: "traceable_object/SOUND_BUZZER_Toggle",
      module_position: {
        point: 'hw_module_user_position/point',
        line: 'hw_module_user_position/line',
        geography: 'location/geography',
      },
      dropdown: {
        user_management: 'user_management/dropdown',
        traceable_object: 'traceable_object/dropdown',
        slot: 'traceable_object/slot/dropdown',
        vehicleType: 'traceable_object/type/dropdown',
        traceable_object_types: 'traceable_object/type/dropdown',
        unassigned_hw_modules: 'hw_module/unassigned_hw_modules/dropdown',
        hw_module: 'hw_module/dropdown',
        rebate: 'test',
        rebate_fixed: 'subscription/rebate/fixed/dropdown',
        rebate_percentage: 'subscription/rebate/percentage/dropdown',
        subscription_model: 'subscription/model/dropdown',
        vehicle_brand: 'traceable_object/brand/dropdown',
        vehicle_model: 'traceable_object/model/dropdown',
        timezone: 'timezone/dropdown',
        language: 'language/dropdown',
        account_type: 'account_type/dropdown',
        hw_action: 'hw_action/dropdown',
        
      }
    }
  },
  scopes: {
    console: 'console',
    hw_modules: 'hw_module',
    locations: 'location',
    rebate: 'rebate',
    rent: 'rent',
    rentStats: 'rent-stats',
    subscription: 'subscription',
    support: 'support',
    vehicles: 'traceable_object',
    map: 'map',
    user_management: 'user_menu',
    report: 'report',
    dashboard: 'admin-dashboard'
  },

  locales: [
    {
      locale: 'hr',
      label: 'app.hr'
    },
    {
      locale: 'en',
      label: 'app.en'
    }
  ],

  startPage: 'login'
};
