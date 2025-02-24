"use client";

import { useState, useEffect } from "react";
import { parseCookies } from "nookies";

export function useAuth(): boolean {
    const [isAuth, setIsAuth] = useState(false);

    useEffect(() => {
        const { _token } = parseCookies();
        setIsAuth(!!_token); 
    }, []);

    return isAuth;
}
