"use client";
import { auth, provider } from "../../firebase";
import { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/types/hooks/use-auth";
import { useEffect } from "react";

export default function LoginPage() {
  const [error, setError] = useState("");
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      router.push("/tickets");
    }
  }, [user, router]);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, provider);
      router.push("/tickets");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div>
      <div>
        <h1>Welcome</h1>
        
        {error && (
          <div>
            {error}
          </div>
        )}

        <button
          onClick={handleGoogleSignIn}
         >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            className="w-5 h-5"
          />
          Sign in with Google
        </button>
      </div>
    </div>
  );
}