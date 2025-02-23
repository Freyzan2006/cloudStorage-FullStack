"use client";

import {
  Navbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@heroui/navbar";
import { Button } from "@heroui/button";



import { link as linkStyles } from "@heroui/theme";
import NextLink from "next/link";
import clsx from "clsx";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/common/components/ux/theme-switch";
import { Logo } from "@/common/components/ui/Logo";
import { LogIn, UserRoundPlus } from "lucide-react";



export const NavBar: React.FC = () => {


  return (
    <Navbar maxWidth = "xl" disableAnimation isBordered >
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarContent className="sm:hidden pr-3" justify="center">
        <NavbarBrand className="gap-3">
          <Logo />
          <p className="font-bold text-inherit">Cloud storage</p>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarBrand className="gap-3">
          <Logo />
          <p className="font-bold text-inherit">Cloud storage</p>
        </NavbarBrand>
        <NavbarItem>
        <ul className=" lg:flex gap-4 justify-start ml-2 flex">
          {siteConfig.navItems.map((item) => (
            <NavbarItem key={item.href}>
              <NextLink
                className={clsx(
                  linkStyles({ color: "foreground" }),
                  "data-[active=true]:text-primary data-[active=true]:font-medium",
                )}
                color="foreground"
                href={item.href}
              >
                {item.label}
              </NextLink>
            </NavbarItem>
          ))}
        </ul>     
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
     
        <NavbarItem className="gap-3 justify-center items-center hidden lg:flex">
          <Button
            // isExternal
            as={NextLink}
            className="text-sm font-normal text-default-600 bg-default-100"
            href={siteConfig.links.auth}
            
            // variant="flat"
          >
            <LogIn /> Логин
          </Button>

          <Button
            // isExternal
            as={NextLink}
            className="text-sm font-normal text-default-600 bg-default-100"
            href={siteConfig.links.auth}
            
            // variant="flat"
          >
            <UserRoundPlus /> Зарегистрировался 
          </Button>
        </NavbarItem>
        <NavbarItem>
          <ThemeSwitch />
        </NavbarItem>
      </NavbarContent>

      
      <NavbarMenu>
        
        {siteConfig.navItems.map((item) => (
            <NavbarMenuItem key={item.href}>
              <NextLink
                className={clsx(
                  linkStyles({ color: "foreground" }),
                  "data-[active=true]:text-primary data-[active=true]:font-medium",
                )}
                color="foreground"
                href={item.href}
              >
                {item.label}
              </NextLink>
            </NavbarMenuItem>
          ))}
        
          <NavbarMenuItem className="flex flex-col items-start gap-3">
            <Button
              // isExternal
              as={NextLink}
              className="text-sm font-normal text-default-600 bg-default-100"
              href={siteConfig.links.auth}
              
              // variant="flat"
            >
              <LogIn /> Логин
            </Button>

            <Button
              // isExternal
              as={NextLink}
              className="text-sm font-normal text-default-600 bg-default-100"
              href={siteConfig.links.auth}
              
              // variant="flat"
            >
              <UserRoundPlus /> Зарегистрировался 
            </Button>
          </NavbarMenuItem>
      </NavbarMenu>
      
    </Navbar>


  );
};

export default NavBar