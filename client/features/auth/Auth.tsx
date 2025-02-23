"use client"

import React from "react"
import { LoginForm } from "./components/LoginForm"
import { RegisterForm } from "./components/RegisterForm"

import css from "./Auth.module.css"
import { range } from "@/common/utils/range"
import { useIsSSR } from "@react-aria/ssr"
import { useTheme } from "next-themes"

export const Auth: React.FC = () => {
    const { theme } = useTheme();
    const isSSR = useIsSSR();

    // const isDarkMode = theme === "dark" && !isSSR;

    const [current, setCurrent] = React.useState<number>(0);
    const [sections, _] = React.useState<React.ReactNode[]>([
        <LoginForm />,
        <RegisterForm />
    ])

    const changeSection = (index: number) => {
        console.log(theme)
        setCurrent(index)
        setKeyFrame(index)
    } 

    const [keyFrame, setKeyFrame] = React.useState<number>();

    return (
        <section className = { css.Auth }>
            <div className = { css.Auth__section } key = { keyFrame }>
                {
                    sections[current]
                }
            </div>

            <div className="flex items-center justify-center gap-3">
                {
                range(0, 2).map(
                (el: number) => 
                    theme != "light" 
                    ?
                    <button onClick = { () => changeSection(el) } key = { el } className={`${el == current ? "bg-primary-500" : "bg-primary-100 " } p-2 rounded-medium `}></button>
                    :
                    <button onClick = { () => changeSection(el) } key = { el } className={` ${el == current ? "bg-primary-500" : "bg-primary-100 " } p-2 rounded-medium `}></button>
                ) 
                }
            </div>         
        </section>
    )
}