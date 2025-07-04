import { auth, provider } from "../../firebase";
import { signInWithPopup } from "firebase/auth";

export default function LoginButton() {
  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("✅ :", user.displayName);
      window.location.href = "/"; // fill in the right info
    } catch (error: any) {
      console.error("❌ :", error.message);
      alert("Login failed. Try again.");
    }
  };

  return (
    <button
      onClick={handleLogin}
      style={{
        backgroundColor: "#4285F4",
        color: "white",
        padding: "10px 20px",
        borderRadius: 6,
        border: "none",
        cursor: "pointer",
      }}
    >
      Sign in with Google
    </button>
  );
}

