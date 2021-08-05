import { ActionModel } from './action.model';

export class LocationModel {
    name: string;
    location_type_id: number;
    location_type: string;
    modules: number[];
    action: ActionModel[];
    date_from: Date;
    date_to: Date;
    show_on_map: boolean;
    active: boolean;
    end_zone: boolean;
    label: string;
    coordinates: any[];
    radius: number;
    color: string;
    icon: string;

    constructor() {
        this.action = [];
    }
}
