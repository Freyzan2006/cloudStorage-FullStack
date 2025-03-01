"use client";

import { useIsSSR } from "@react-aria/ssr";
import { useTheme } from "next-themes";

import { TChildren } from "@/common/types/children.type";

export const Title: React.FC<{ children: TChildren }> = ({ children }) => {
  const { theme } = useTheme();
  const isSSR = useIsSSR();

  const isDarkMode = theme === "dark" && !isSSR;

  return isDarkMode ? (
    <h2 className="text-white">{children}</h2>
  ) : (
    <h2 className="text-primary-500">{children}</h2>
  );
};
