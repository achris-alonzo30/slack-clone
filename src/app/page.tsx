"use client";

import { useAuthActions } from "@convex-dev/auth/react";

export default function Home() {
  const { signOut } = useAuthActions();
  return (
    <button onClick={() => signOut()}>Sign Out</button>
  );
}
