"use client"

import { AuthControl } from "@/features/auth/components/AuthControl";
import { useGetMe } from "@/features/auth/hooks/useGetMe.hook";
import { IUser } from "@/features/userInfo/dto/user.dto";
import {Accordion, AccordionItem, Avatar} from "@heroui/react";
import React from "react";



export const UserInfo: React.FC = () => {
    const defaultContent ="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";
    const { userData, loading, error  } = useGetMe()

    if ( loading ) return <div>Loading</div>
    if ( error ) return <div>Err: {error}</div>
    if ( !userData ) return <div>Нету пользователя</div>

    return (
      <Accordion selectionMode="multiple">
        <AccordionItem
          key="1"
          aria-label= { userData.fullName }
          startContent={
            <Avatar
              isBordered
              color="primary"
              radius="lg"
            />
          }
          subtitle={
            <p className="flex flex-col gap-3">
                
            </p>
          }
          title = { userData.fullName }
        >
            {defaultContent}
            <span>ID: { userData.id }</span>
            <span>Email: { userData.email }</span>
            <AuthControl />
        </AccordionItem>
      </Accordion>
      );
}