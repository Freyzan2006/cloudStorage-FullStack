export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Cloud storage",
  description: "Облачное хранилище для ваше удобства",
  navItems: [
    {
      label: "Главная страница",
      href: "/",
    },
    {
      label: "О проекте",
      href: "/about",
    },
  ],
  navMenuItems: [
    {
      label: "Логин",
      href: "/dashboard/auth",
    },
    {
      label: "Зарегистрировался",
      href: "/dashboard",
    },
  ],
  links: {
    auth: "/auth",
    dashboard: "/dashboard",
    profile: "/profile",

    // github: "https://github.com/heroui-inc/heroui",
    // twitter: "https://twitter.com/hero_ui",
    // docs: "https://heroui.com",
    // discord: "https://discord.gg/9b6yyZKmH4",
    // sponsor: "https://patreon.com/jrgarciadev",
  },
};
