import { UserEntity } from "src/users/entities/user.entity";
import { Column, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";



export enum EFileType {
    ALL = "all",
    PHOTOS = "photos",
    TRASH = "trash",
    FILES = "files"
}

@Entity("files")
export class FileEntity {
    @PrimaryGeneratedColumn()
    id: number 

    @Column()
    filename: string;

    @Column()
    originalName: string

    @Column()
    size: number

    @Column()
    mimetype: string

    @ManyToOne(() => UserEntity, (user) => user.files)
    user: UserEntity;

    @DeleteDateColumn()
    deletedAt?: Date



}
