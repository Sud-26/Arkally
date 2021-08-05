export class Support {
    active: boolean;
    id: number;
    email: string;
    message: string;
    subject: string;
    file_name: string;
    user_fullname: string;
    user_id: number;
    deleted: boolean;

    constructor() {
        this.active = false;
        this.deleted = false;
    }
}
