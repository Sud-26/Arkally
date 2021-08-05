import { MenuGroupConfig } from './menu-group.config';

export interface MenuConfig {
    selectedColor:string;
    selectedClass:string;
    groups?: MenuGroupConfig[];
}