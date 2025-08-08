import { auth, provider } from "@/firebase";
import { signInWithPopup } from "firebase/auth";
import Link from "next/link";

export default function LoginButton() {
  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("✅ :", user.displayName);
      window.location.href = "/tickets"; // fill in the right info
    } catch (error: any) {
      console.error("❌ :", error.message);
      alert("Login failed. Try again.");
    }
  };

  return (
    <button
      onClick={handleLogin}
     className="bg-emerald-500 hover:bg-emerald-600 text-white py-3 px-5 rounded border-none cursor-pointer w-full flex items-center justify-center gap-2"
    >
      <img src="/GoogleLogo.png" className="w-[25px]"/> 
      <p>Sign in</p>
    </button>
  );
}