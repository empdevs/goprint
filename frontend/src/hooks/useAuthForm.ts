import { useState } from "react";
import { initialFeedbackForm, initialRegisterForm } from "../constants";
import { useGoPrint } from "./useGoPrint";

export function useAuthForm() {
  const { feedbacks, login, register, submitFeedback } = useGoPrint();
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [loginEmail, setLoginEmail] = useState("user@goprint.local");
  const [loginPassword, setLoginPassword] = useState("student123");
  const [registerForm, setRegisterForm] = useState(initialRegisterForm);
  const [feedbackForm, setFeedbackForm] = useState(initialFeedbackForm);

  async function handleLogin() {
    await login(loginEmail, loginPassword);
  }

  async function handleRegister() {
    await register(registerForm);
    setRegisterForm(initialRegisterForm);
  }

  async function handleFeedbackSubmit() {
    await submitFeedback(feedbackForm);
    setFeedbackForm(initialFeedbackForm);
  }

  return {
    feedbacks,
    authMode,
    setAuthMode,
    loginEmail,
    setLoginEmail,
    loginPassword,
    setLoginPassword,
    registerForm,
    setRegisterForm,
    feedbackForm,
    setFeedbackForm,
    handleLogin,
    handleRegister,
    handleFeedbackSubmit
  };
}
