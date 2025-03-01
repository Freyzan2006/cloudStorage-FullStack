import { Auth } from "@/features/auth/Auth";

export const metadata = {
  title: "Вход в аккаунт или регистрация аккаунта",
  description: "Страница авторизации/регистрации для пользователей",
};

export default function AuthPage() {
  return (
    <section>
      <Auth />
    </section>
  );
}
