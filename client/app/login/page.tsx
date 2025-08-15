"use client";
import LoginButton from "@/components/ui/LoginButton";
import Image from "next/image";

export default function LoginPage() {
  return (
    <main className="dnest-bg" style={{ display: "grid", placeItems: "center", height: "90vh" }}>
      <div className="w-full max-w-md bg-white rounded-md p-5 text-black shadow-xl/30 flex flex-col justify-between items-center">
        <Image
          src="/DN_vertical.png"
          alt="Digital Nest Logo"
          width={0}
          height={0}
          className="mb-4"
          style={{ width: "100%", height: "auto", maxWidth: 120 }}
          sizes="(max-width: 600px) 80vw, 170px"
        />
        <h1 className="text-xl text-center mb-4">Welcome to NestQueue! Please Log in.</h1>
        <Image
          src="/Login.png"
          alt="log in!"
          width={0}
          height={0}
          className="p-2"
          style={{ width: "100%", height: "auto", maxWidth: 250 }}
          sizes="(max-width: 600px) 80vw, 250px"
        />
        <LoginButton />
      </div>
    </main>
  );
}

