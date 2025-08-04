"use client";
import LoginButton from "@/components/ui/LoginButton";

export default function Home() {
  return (
    <main style={{ display: "grid", placeItems: "center", height: "100vh" }}>
      <h1>Welcome! Please Sign In</h1>
      <LoginButton />
    </main>
  );

}
