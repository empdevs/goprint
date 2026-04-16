import { useState } from "react";
import { initialOrderForm } from "../constants";
import { useGoPrint } from "./useGoPrint";

export function useOrderForm() {
  const { createOrder } = useGoPrint();
  const [orderForm, setOrderForm] = useState(initialOrderForm);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  function setDocumentFile(file: File | null) {
    setSelectedFile(file);
    setOrderForm((current) => ({
      ...current,
      fileName: file?.name ?? ""
    }));
  }

  function updateQuantity(field: "printQty" | "copyQty" | "bindingQty", nextValue: number) {
    setOrderForm((current) => ({
      ...current,
      [field]: Math.max(0, nextValue)
    }));
  }

  async function handleSubmit() {
    await createOrder(orderForm, selectedFile);
    setOrderForm(initialOrderForm);
    setSelectedFile(null);
  }

  return {
    orderForm,
    setOrderForm,
    selectedFile,
    setDocumentFile,
    updateQuantity,
    handleSubmit
  };
}
