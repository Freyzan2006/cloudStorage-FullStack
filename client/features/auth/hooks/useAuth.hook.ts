"use client";

import { useState, useEffect } from "react";
import { parseCookies } from "nookies";

interface IAuth {
  isAuth: boolean;
}

export function useAuth(): IAuth {
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const { _token } = parseCookies();

    setIsAuth(!!_token);
  }, []);

  return {
    isAuth,
  };
}
