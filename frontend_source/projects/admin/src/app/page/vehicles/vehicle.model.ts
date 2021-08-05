export class Vehicle {
    action: boolean;
    active: boolean;
    deleted: boolean;
    consumption: number;
    registration_number: string;
    vin_number: string;
    vehicle_year: Date;
    vehicle_brand_id: number;
    vehicle_model_id: number;
    vehicle_default_throttle: number;
    id: number;
    name: string;
    note: string;
    show_on_map: boolean;
    traceable_object_type_id: number;
    traceable_object_type_name: string;
    user_fullname: string;
    user_id: number;
    vehicle_default_speed: number;
    collision_avoidance_system: boolean;

    constructor() {
        this.show_on_map = false;
        this.active = false;
        this.deleted = false;
        this.action = false;
        this.collision_avoidance_system = false;
    }
}