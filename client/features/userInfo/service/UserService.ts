import { IUser } from "../dto/user.dto";

import { BaseService } from "@/common/services/BaseService";
import axios from "@/config/axios";

class UserService extends BaseService {
  public async getMe(): Promise<IUser> {
    return (await axios.get(this.fullUrlAPI("/me"))).data;
  }
}

export const userService = new UserService("/users");
