"use client";

import { useState, useEffect } from "react";

import { IUser } from "@/features/userInfo/dto/user.dto";
import { userService } from "@/features/userInfo/service/UserService";

export interface IGetMe {
  userData: IUser | null;
  loading: boolean;
  error: string | null;
}

export const useGetMe = (): IGetMe => {
  const [userData, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const data = await userService.getMe();

        setUser(data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Ошибка загрузки");
      } finally {
        setLoading(false);
      }
    };

    getUserData();
  }, []);

  return { userData, loading, error };
};
