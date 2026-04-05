import { useState } from "react";
import { initialOrderForm } from "../constants";
import { useGoPrint } from "./useGoPrint";
export function useOrderForm() {
    const { createOrder } = useGoPrint();
    const [orderForm, setOrderForm] = useState(initialOrderForm);
    const [selectedFile, setSelectedFile] = useState(null);
    async function handleSubmit(event) {
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
