"use client";

import { useState } from "react";
import { AuthFlow } from "../types";
import { SignInCard } from "./SignInCard";
import { SignUpCard } from "./SignUpCard";

export const AuthScreen = () => {
  const [authFlow, setAuthFlow] = useState<AuthFlow>("signIn"); 

  return (
    <section className="h-full flex items-center justify-center bg-[#5C3B58]">
      <aside className="md:h-auto md:w-[420px]">
        {authFlow === "signIn" ? <SignInCard /> : <SignUpCard />}
      </aside>
    </section>
  );
};