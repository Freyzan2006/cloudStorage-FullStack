import { create } from "zustand";

export enum EAlertType {
  SUCCESS = "success",
  INFO = "primary",
  WARNING = "warning",
}

interface AlertState {
  message: string;
  isOpen: boolean;
  typeMessage: EAlertType;
  showAlert: (message: string, typeMessage: EAlertType) => void;
  closeAlert: () => void;
}

export const useAlertStore = create<AlertState>((set) => ({
  message: "",
  isOpen: false,
  typeMessage: EAlertType.INFO,

  showAlert: (message: string, typeMessage: EAlertType) =>
    set({ message, isOpen: true, typeMessage: typeMessage }),
  closeAlert: () => set({ isOpen: false }),
}));
