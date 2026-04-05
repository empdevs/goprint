import { useContext } from "react";
import { GoPrintContext } from "../context/GoPrintContext";

export function useGoPrint() {
  const context = useContext(GoPrintContext);

  if (!context) {
    throw new Error("useGoPrint must be used within GoPrintProvider");
  }

  return context;
}
