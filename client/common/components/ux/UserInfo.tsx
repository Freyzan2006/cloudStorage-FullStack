"use client";

import { Accordion, AccordionItem, Avatar } from "@heroui/react";
import React from "react";

import { AuthControl } from "@/features/auth/components/AuthControl";
import { useGetMe } from "@/features/auth/hooks/useGetMe.hook";

export const UserInfo: React.FC = () => {
  const defaultContent =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";
  const { userData, loading, error } = useGetMe();

  if (loading) return <div className="text-foreground">Загрузка...</div>;
  if (error) return <div className="text-danger">Ошибка: {error}</div>;
  if (!userData)
    return <div className="text-foreground">Нету пользователя</div>;

  return (
    <div className="w-full sm:w-[600px] md:w-[700px] lg:w-[800px] mx-auto p-4">
      <Accordion
        className="shadow-lg rounded-2xl bg-content1 p-6 min-w-[300px]"
        selectionMode="multiple"
      >
        <AccordionItem
          key="1"
          aria-label={userData.fullName}
          className="px-2 py-1"
          startContent={
            <Avatar
              isBordered
              className="w-20 h-20"
              color="primary"
              name={userData.fullName}
              radius="lg"
              size="lg"
            />
          }
          subtitle={
            <div className="flex flex-col gap-2 mt-2 text-foreground-500 rounded-xl">
              <div className="flex items-center gap-2">
                <span className="font-medium text-foreground">Email:</span>
                <span>{userData.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-foreground">ID:</span>
                <span>{userData.id}</span>
              </div>
            </div>
          }
          title={
            <span className="text-xl font-semibold text-foreground">
              {userData.fullName}
            </span>
          }
        >
          <div className="p-4 space-y-4">
            <div className="bg-content2 p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-2 text-foreground">
                О пользователе
              </h3>
              <p className="text-foreground-500">{defaultContent}</p>
            </div>
            <div className="mt-4 flex justify-center items-center gap-3">
              <AuthControl />
            </div>
          </div>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
