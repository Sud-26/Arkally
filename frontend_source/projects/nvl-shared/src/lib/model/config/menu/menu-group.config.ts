import { MenuItem } from './menu-item.config';

export interface MenuGroupConfig {
    header?: string;
    items: MenuItem[];
    divider?: boolean;
    hidden?: boolean;
}