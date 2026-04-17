import { useState } from "react";
import { initialOrderForm } from "../constants";
import { OrderDraftItem } from "../types";
import { useGoPrint } from "./useGoPrint";

export function useOrderForm() {
  const { createOrder } = useGoPrint();
  const [orderForm, setOrderForm] = useState(initialOrderForm);

  function addFiles(files: File[]) {
    const nextItems: OrderDraftItem[] = files.map((file) => ({
      id: crypto.randomUUID(),
      file,
      fileName: file.name,
      printQty: 1,
      copyQty: 0,
      bindingQty: 0,
      description: ""
    }));

    setOrderForm((current) => ({
      ...current,
      items: [...current.items, ...nextItems]
    }));
  }

  function removeItem(itemId: string) {
    setOrderForm((current) => ({
      ...current,
      items: current.items.filter((item) => item.id !== itemId)
    }));
  }

  function updateQuantity(
    itemId: string,
    field: "printQty" | "copyQty" | "bindingQty",
    nextValue: number
  ) {
    setOrderForm((current) => ({
      ...current,
      items: current.items.map((item) =>
        item.id === itemId
          ? {
              ...item,
              [field]: Math.max(0, nextValue)
            }
          : item
      )
    }));
  }

  function updateDescription(itemId: string, description: string) {
    setOrderForm((current) => ({
      ...current,
      items: current.items.map((item) => (item.id === itemId ? { ...item, description } : item))
    }));
  }

  async function handleSubmit() {
    const isSuccess = await createOrder(orderForm);

    if (isSuccess) {
      setOrderForm(initialOrderForm);
    }
  }

  return {
    orderForm,
    setOrderForm,
    addFiles,
    removeItem,
    updateQuantity,
    updateDescription,
    handleSubmit
  };
}
