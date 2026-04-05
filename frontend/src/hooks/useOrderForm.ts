import { FormEvent, useState } from "react";
import { initialOrderForm } from "../constants";
import { useGoPrint } from "./useGoPrint";

export function useOrderForm() {
  const { createOrder } = useGoPrint();
  const [orderForm, setOrderForm] = useState(initialOrderForm);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await createOrder(orderForm, selectedFile);
    setOrderForm(initialOrderForm);
    setSelectedFile(null);
  }

  return {
    orderForm,
    setOrderForm,
    selectedFile,
    setSelectedFile,
    handleSubmit
  };
}
