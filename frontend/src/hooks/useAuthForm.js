import { useState } from "react";
import { initialRegisterForm } from "../constants";
import { useGoPrint } from "./useGoPrint";
export function useAuthForm() {
    const { login, register } = useGoPrint();
    const [authMode, setAuthMode] = useState("login");
    const [loginEmail, setLoginEmail] = useState("student@goprint.local");
    const [loginPassword, setLoginPassword] = useState("student123");
    const [registerForm, setRegisterForm] = useState(initialRegisterForm);
    async function handleLogin(event) {
        event.preventDefault();
        await login(loginEmail, loginPassword);
    }
    async function handleRegister(event) {
        event.preventDefault();
        await register(registerForm);
        setRegisterForm(initialRegisterForm);
    }
    return {
        authMode,
        setAuthMode,
        loginEmail,
        setLoginEmail,
        loginPassword,
        setLoginPassword,
        registerForm,
        setRegisterForm,
        handleLogin,
        handleRegister
    };
}
