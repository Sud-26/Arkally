export class Rent {
    id: number;
    user_id: number;
    user_fullname: string;
    action_id: number;
    action_name: string;
    action_type: string;
    hw_module_id: number;
    traceable_object_id: number;
    state: string;
    value: string;
    date_from: Date;
    alaram_time:string;
    date_to: Date;
    active: boolean;
    deleted: boolean;

    constructor() {
        this.active = true;
        this.deleted = false;
        this.state = 'pending';
        this.value = 'true';
        this.action_id = 6;
        this.action_name = 'SOUND BUZZER';
        this.action_type = 'timed_service';
    }

}
