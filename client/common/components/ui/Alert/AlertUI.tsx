"use client";

import { Alert } from "@heroui/react";
import React from "react";

import css from "./Alert.module.css";

import { useAlertStore } from "@/common/store/alertStore";

export default function AlertUI() {
  const { message, isOpen, closeAlert, typeMessage } = useAlertStore();
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => closeAlert(), 500);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  return (
    isOpen && (
      <Alert
        className={`${css.Alert} ${isVisible ? css.show : css.hide} fixed bottom-10 max-w-[350px] w-full cursor-pointer right-10 z-30`}
        color={typeMessage}
        description={message}
        title="Сообщение:"
        variant="faded"
        onClose={closeAlert}
      />
    )
  );
}
