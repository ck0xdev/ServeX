import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import emailjs from "@emailjs/browser";
import { Mail, ArrowLeft } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const generateOTP = () =>
    Math.floor(100000 + Math.random() * 900000).toString();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    try {
      const otp = generateOTP();
      const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

      // Save OTP to Firestore
      await setDoc(doc(db, "otps", email), {
        code: otp,
        expiresAt,
        verified: false,
        createdAt: Date.now(),
      });

      // Send OTP via EmailJS
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          user_email: email,
          otp: otp,
          time: new Date().toLocaleString("en-IN", {
            dateStyle: "medium",
            timeStyle: "short",
          }),
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      navigate("/verify-otp", { state: { email } });
    } catch (err) {
      console.error(err);
      setError("Failed to send OTP. Please check the email and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: "#f0f4f8" }}
    >
      <div
        className="w-full max-w-md p-8"
        style={{
          background: "#e8edf2",
          borderRadius: "20px",
          boxShadow: "8px 8px 16px #d1d9e6, -8px -8px 16px #ffffff",
        }}
      >
        {/* Back Link */}
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-sm mb-6"
          style={{ color: "#718096" }}
        >
          <ArrowLeft size={16} />
          Back to Login
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1
            className="text-2xl font-bold mb-2"
            style={{ color: "#2d3748" }}
          >
            Forgot Password
          </h1>
          <p className="text-sm" style={{ color: "#718096" }}>
            Enter your registered email. We will send a 6-digit OTP to verify
            your identity.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Input */}
          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: "#2d3748" }}
            >
              Email Address
            </label>
            <div className="relative">
              <div
                className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: "#718096" }}
              >
                <Mail size={18} />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full pl-10 pr-4 py-3 text-sm outline-none transition-all"
                style={{
                  background: "#e8edf2",
                  borderRadius: "12px",
                  boxShadow:
                    "inset 4px 4px 8px #d1d9e6, inset -4px -4px 8px #ffffff",
                  border: "none",
                  color: "#2d3748",
                }}
                onFocus={(e) => {
                  e.target.style.boxShadow =
                    "inset 6px 6px 12px #d1d9e6, inset -6px -6px 12px #ffffff, 0 0 0 2px #5b8bf7";
                }}
                onBlur={(e) => {
                  e.target.style.boxShadow =
                    "inset 4px 4px 8px #d1d9e6, inset -4px -4px 8px #ffffff";
                }}
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <p
              className="text-sm px-3 py-2 rounded-lg"
              style={{
                color: "#e53e3e",
                background: "#fff5f5",
                border: "1px solid #feb2b2",
              }}
            >
              {error}
            </p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 text-sm font-semibold transition-all"
            style={{
              background: loading
                ? "#a0aec0"
                : "linear-gradient(145deg, #6b9bf8, #4a7af6)",
              borderRadius: "12px",
              boxShadow: loading
                ? "none"
                : "6px 6px 12px #d1d9e6, -6px -6px 12px #ffffff",
              color: "#ffffff",
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
            }}
            onMouseDown={(e) => {
              if (!loading) {
                e.currentTarget.style.boxShadow =
                  "inset 4px 4px 8px rgba(0,0,0,0.15), inset -4px -4px 8px rgba(255,255,255,0.1)";
              }
            }}
            onMouseUp={(e) => {
              if (!loading) {
                e.currentTarget.style.boxShadow =
                  "6px 6px 12px #d1d9e6, -6px -6px 12px #ffffff";
              }
            }}
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>

        {/* Footer Note */}
        <p className="text-center text-xs mt-6" style={{ color: "#718096" }}>
          Remember your password?{" "}
          <Link
            to="/login"
            className="font-medium"
            style={{ color: "#5b8bf7" }}
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
