"use client";

import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import VerifyCodeForm from "@/components/auth/VerifyCodeForm";
import { useState } from "react";

export default function RegisterPage() {
  const [step, setStep] = useState<"login" | "register" | "verify">("login");
  const [email, setEmail] = useState("");

  return (
    <div className="flex h-full flex-1 items-center justify-center">
      {step === "login" && <LoginForm toggleForm={() => setStep("register")} />}
      {step === "register" && (
        <RegisterForm
          onRegistered={(userEmail) => {
            setEmail(userEmail);
            setStep("verify");
          }}
          toggleForm={() => setStep("login")}
        />
      )}
      {step === "verify" && <VerifyCodeForm email={email} />}
    </div>
  );
}
