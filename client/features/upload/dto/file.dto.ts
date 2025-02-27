import { IUser } from "@/features/userInfo/dto/user.dto";


export interface IFileDTO {
    filename: string;
    originalName: string;
    size: number;
    mimetype: string;
    user: IUser
    deletedAt: string | null;
    id: number;
}
