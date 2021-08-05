export class HwModule {
    name: string;
    show_on_map: boolean;
    user_id: string;
    traceable_object_id: string;
    active: boolean;
    module_id: string;

    constructor() {
        this.show_on_map = false;
        this.active = false;
    }
}

