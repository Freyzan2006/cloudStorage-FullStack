"use client";

import React from "react";

import { LoginForm } from "./components/LoginForm";
import { RegisterForm } from "./components/RegisterForm";
import css from "./Auth.module.css";

import { range } from "@/common/utils/range";

export const Auth: React.FC = () => {
  const [current, setCurrent] = React.useState<number>(0);
  const [sections] = React.useState<React.ReactNode[]>([
    <LoginForm key="login" />,
    <RegisterForm key="register" />,
  ]);

  const changeSection = (index: number) => {
    setCurrent(index);
    setKeyFrame(index);
  };

  const [keyFrame, setKeyFrame] = React.useState<number>(0);

  return (
    <section className={css.Auth}>
      <div key={keyFrame} className={css.Auth__section}>
        {sections[current]}
      </div>

      <div className="flex items-center justify-center gap-3">
        {range(0, 2).map((el: number) => (
          <button
            key={el}
            className={`p-2 rounded-medium ${
              el === current ? "bg-primary-500" : "bg-primary-100"
            }`}
            onClick={() => changeSection(el)}
          />
        ))}
      </div>
    </section>
  );
};
