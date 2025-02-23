'use client'

// import { ThemeProvider } from "@emotion/react"
import { Footer } from "./Footer"
import { Header } from "./Header"
import theme from "../../styles/theme"

interface IProps {
    children: React.ReactNode 
}

export const Layout: React.FC<IProps> = ({ children }) => {
    return (    
        <>
            {/* <ThemeProvider theme={theme}> */}
                <Header />
                <main>{ children }</main>
                <Footer />
            {/* </ThemeProvider> */}
        </>
    )
}