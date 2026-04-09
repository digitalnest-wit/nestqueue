"use client";
import LoginButton from "@/components/ui/LoginButton";
import Image from "next/image";

export default function LoginPage() {
  return (
    <main
      className="grid min-h-screen place-items-center px-4"
      style={{
        background:
          "radial-gradient(circle at top, rgba(22,163,74,0.12), transparent 30%), linear-gradient(180deg, #f4fbf5 0%, #eef3f9 100%)",
      }}
    >
      <div className="flex w-full max-w-md flex-col items-center justify-between rounded-[24px] border border-white/70 bg-white p-5 text-black shadow-xl/30 backdrop-blur">
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
