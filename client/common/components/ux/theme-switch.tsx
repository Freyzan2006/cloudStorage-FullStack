"use client";

import { FC } from "react";
import { VisuallyHidden } from "@react-aria/visually-hidden";
import { SwitchProps, useSwitch } from "@heroui/switch";
import { useTheme } from "next-themes";
import { useIsSSR } from "@react-aria/ssr";
import clsx from "clsx";

import { MdDarkMode } from "react-icons/md";
import { MdOutlineLightMode } from "react-icons/md";
import { EAlertType, useAlertStore } from "@/common/store/alertStore";

export interface ThemeSwitchProps {
  className?: string;
  classNames?: SwitchProps["classNames"];
}

export const ThemeSwitch: FC<ThemeSwitchProps> = ({
  className,
  classNames,
}) => {
  const { theme, setTheme } = useTheme();
  const isSSR = useIsSSR();
  const { showAlert } = useAlertStore();

  const isDarkMode = theme === "dark" && !isSSR;

  const onChange = () => {
    showAlert("Вы успешно изменили тему", EAlertType.SUCCESS)

    theme === "light" ? setTheme("dark") : setTheme("light");
    setTheme(isDarkMode ? "light" : "dark");
  };

  const {
    Component,
    slots,
    isSelected,
    getBaseProps,
    getInputProps,
    getWrapperProps,
  } = useSwitch({
    isSelected: theme === "light" || isSSR,
    "aria-label": `Switch to ${theme === "light" || isSSR ? "dark" : "light"} mode`,
    onChange,
  });

  return (
    <Component
      {...getBaseProps({
        className: clsx(
          "px-px transition-opacity hover:opacity-80 cursor-pointer",
          className,
          classNames?.base,
        ),
      })}
    >
      <VisuallyHidden>
        <input {...getInputProps()} />
      </VisuallyHidden>
      <div
        {...getWrapperProps()}
        className={slots.wrapper({
          class: clsx(
            [
              "w-auto h-auto",
              "bg-transparent",
              "rounded-lg",
              "flex items-center justify-center",
              "group-data-[selected=true]:bg-transparent",
              "!text-default-500",
              "pt-px",
              "px-0",
              "mx-0",
             
            ],
            classNames?.wrapper,
          ),
        })}
      >


        {isDarkMode || !isSelected || isSSR ? (
          <MdOutlineLightMode fontSize={25} className="text-primary-500" />
          
        ) : (
          <MdDarkMode fontSize={25} className="text-primary-300" />
        )}
      </div>
    </Component>
  );
};
