import { AvatarConfig } from './avatar.config';
import { MenuConfig } from './menu/menu.config';
import { NavbarConfig } from './navbar.config';

export interface RootLayoutConfig {
    title?: string;
    avatar?: AvatarConfig;
    navbar?: NavbarConfig;
    menu: MenuConfig;
}