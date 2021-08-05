export class Subscription {
    id: number;
    user_id: number;
    hw_module_id: number;
    user_fullname: string;
    subscription_model_id: string;
    subscription_model_description: string;
    rebate_id: number;
    rebate_is_fixed: boolean;
    rebate_value: number;
    meta_information: string;
    unit_count: number;
    date_from: Date;
    date_to: Date;
    active: boolean;
    deleted: boolean;

    constructor() {
        this.active = false;
        this.deleted = false;
        this.rebate_is_fixed = false;
    }

}
