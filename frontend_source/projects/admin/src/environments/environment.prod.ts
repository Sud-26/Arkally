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
      console: 'console',
      vehicles: 'traceable_object',
      command: 'traceable_object/create_command',
      locations: 'location',
      support: 'support',
      subscription: 'subscription',
      rebate: 'subscription/rebate',
      user_management: 'user_management',
      update_password: 'user_management/update_password',
      update_map_pool_time: 'user_management/update_map_pool_time',
      update_timezone: 'user_management/update_timezone',
      report: 'nvl_report',
      trip_info: 'nvl_report/trip_info',
      rent: 'rent',
      module_position: {
        point: 'hw_module_user_position/point',
        line: 'hw_module_user_position/line',
        geography: 'location/geography',
      },
      dropdown: {
        user_management: 'user_management/dropdown',
        traceable_object: 'traceable_object/dropdown',
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
