import { AvatarConfig } from './avatar.config';
import { NavbarConfig } from './navbar.config';

export interface LoginConfig {
    title?: string;
    avatar?: AvatarConfig;
    navbar?: NavbarConfig;
}