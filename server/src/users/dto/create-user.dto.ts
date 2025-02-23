import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
    @ApiProperty({
        default: "test@test.uz"
    })
    email: string

    @ApiProperty({
        default: "Timur Tukfatullin"
    })
    fullName: string;

    @ApiProperty({
        default: "123"
    })
    password: string;
}
