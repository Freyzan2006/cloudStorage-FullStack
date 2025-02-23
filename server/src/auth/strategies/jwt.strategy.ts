
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";  
import { UsersService } from "src/users/users.service";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly userService: UsersService) {
        const secretKey = process.env.SECRET_KEY;

        if (!secretKey) {
            throw new Error("SECRET_KEY is not defined in environment variables");
        }

        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: secretKey,  
        });
    }

    async validate(payload: any) {
        const user = await this.userService.findById(+payload.id);

        if (!user) throw new UnauthorizedException("У вас нет доступа")

        return { id: user.id }
    }
}