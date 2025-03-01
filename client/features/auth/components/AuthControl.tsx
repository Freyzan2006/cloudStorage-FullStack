"use client";

import { Button } from "@heroui/button";
import { LogIn, LogOut, Table2, UserRoundPlus } from "lucide-react";
import { Avatar } from "@heroui/react";
import NextLink from "next/link";
import React from "react";

import { authService } from "../service/AuthService";
import { useAuth } from "../hooks/useAuth.hook";
import { useGetMe } from "../hooks/useGetMe.hook";

import { EAlertType, useAlertStore } from "@/common/store/alertStore";
import { siteConfig } from "@/config/site";

export const AuthControl: React.FC = () => {
  const { isAuth } = useAuth();
  const { userData, loading } = useGetMe();

  const { showAlert } = useAlertStore();

  const onClickLogout = () => {
    showAlert("Вы успешно вышли из акк", EAlertType.SUCCESS);
    const timer = setTimeout(() => {
      authService.logout();
      location.href = "/";
    }, 1000);

    return () => clearTimeout(timer);
  };

  return (
    <>
      {!isAuth ? (
        <>
          <Button
            as={NextLink}
            className="text-sm font-normal text-default-600 bg-default-100"
            href={siteConfig.links.auth}
          >
            <LogIn /> Логин
          </Button>

          <Button
            as={NextLink}
            className="text-sm font-normal text-default-600 bg-default-100"
            href={siteConfig.links.auth}
          >
            <UserRoundPlus /> Зарегистрировался
          </Button>
        </>
      ) : (
        <>
          <Button
            as={NextLink}
            className="text-sm font-normal text-default-600 bg-default-100"
            href={siteConfig.links.profile}
          >
            <Avatar size="sm" /> {loading ? "Профиль" : userData?.fullName}
          </Button>
          <Button
            as={NextLink}
            className="text-sm font-normal text-default-600 bg-default-100"
            href={siteConfig.links.dashboard}
          >
            <Table2 /> Доска
          </Button>
          <Button
            className="text-sm font-normal text-default-600 bg-default-100"
            onPress={onClickLogout}
          >
            <LogOut /> Выйти
          </Button>
        </>
      )}
    </>
  );
};
