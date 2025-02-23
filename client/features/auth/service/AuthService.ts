
import axios from "@/config/axios"
import { BaseService } from "../../../common/services/BaseService"
import { ILoginFormDTO, ILoginResponseDTO, TRegisterFormDTO, TRegisterResponseDTO } from "../dto/auth.dto";
import { destroyCookie } from "nookies";



class AuthService extends BaseService {

    public async login(values: ILoginFormDTO) : Promise<ILoginResponseDTO> {
        return (await axios.post(this.fullUrlAPI("/login"), values)).data;
    }

    public async register(values: TRegisterFormDTO) : Promise<TRegisterResponseDTO> {
        return ((await axios.post(this.fullUrlAPI("/register"), values)).data)
    }

    public logout() : void {
        destroyCookie(null, "_token", { path: "/" })
    }
}

export const authService = new AuthService("/auth")