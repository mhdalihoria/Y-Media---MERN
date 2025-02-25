import { create } from "zustand";

type AlertState = {
  status: null | string;
  message: null | string;
  setAlert: (status: string | null, message: string | null) => void;
};

export const useAlertStore = create<AlertState>((set) => ({
  status: null,
  message: null,
  setAlert: (status, message) =>
    set((state) => ({ ...state, status, message })),
}));