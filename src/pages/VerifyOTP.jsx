import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";
import emailjs from "@emailjs/browser";
import { ArrowLeft, RefreshCw } from "lucide-react";

const VerifyOTP = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [resending, setResending] = useState(false);

  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  // Redirect if no email in state
  useEffect(() => {
    if (!email) {
      navigate("/forgot-password");
    }
  }, [email, navigate]);

  // Resend countdown timer
  useEffect(() => {
    if (resendTimer === 0) {
      setCanResend(true);
      return;
    }
    const interval = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleChange = (index, value) => {
    // Allow only digits
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Take only last character
    setOtp(newOtp);
    setError("");

    // Auto focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Move back on backspace if current field is empty
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(""));
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const enteredOtp = otp.join("");

    if (enteredOtp.length < 6) {
      setError("Please enter all 6 digits.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const otpDoc = await getDoc(doc(db, "otps", email));

      if (!otpDoc.exists()) {
        setError("OTP not found. Please request a new one.");
        setLoading(false);
        return;
      }

      const { code, expiresAt } = otpDoc.data();

      // Check expiry
      if (Date.now() > expiresAt) {
        await deleteDoc(doc(db, "otps", email));
        setError("OTP has expired. Please request a new one.");
        setLoading(false);
        return;
      }

      // Check code match
      if (enteredOtp !== code) {
        setError("Incorrect OTP. Please try again.");
        setLoading(false);
        return;
      }

      // Mark as verified
      await setDoc(
        doc(db, "otps", email),
        { verified: true, verifiedAt: Date.now() },
        { merge: true }
      );

      // Navigate to reset password with verified state
      navigate("/reset-password", { state: { email, otpVerified: true } });
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError("");

    try {
      const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = Date.now() + 10 * 60 * 1000;

      await setDoc(doc(db, "otps", email), {
        code: newOtp,
        expiresAt,
        verified: false,
        createdAt: Date.now(),
      });

      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          user_email: email,
          otp: newOtp,
          time: new Date().toLocaleString("en-IN", {
            dateStyle: "medium",
            timeStyle: "short",
          }),
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      setOtp(["", "", "", "", "", ""]);
      setResendTimer(60);
      setCanResend(false);
      inputRefs.current[0]?.focus();
    } catch (err) {
      console.error(err);
      setError("Failed to resend OTP. Please try again.");
    } finally {
      setResending(false);
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
          to="/forgot-password"
          className="inline-flex items-center gap-2 text-sm mb-6"
          style={{ color: "#718096" }}
        >
          <ArrowLeft size={16} />
          Back
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1
            className="text-2xl font-bold mb-2"
            style={{ color: "#2d3748" }}
          >
            Enter OTP
          </h1>
          <p className="text-sm" style={{ color: "#718096" }}>
            A 6-digit code was sent to{" "}
            <span className="font-medium" style={{ color: "#2d3748" }}>
              {email}
            </span>
            . It expires in 10 minutes.
          </p>
        </div>

        {/* OTP Input Boxes */}
        <form onSubmit={handleVerify}>
          <div className="flex gap-3 justify-between mb-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                className="w-12 h-14 text-center text-xl font-bold outline-none transition-all"
                style={{
                  background: "#e8edf2",
                  borderRadius: "12px",
                  boxShadow: digit
                    ? "inset 4px 4px 8px #d1d9e6, inset -4px -4px 8px #ffffff, 0 0 0 2px #5b8bf7"
                    : "inset 4px 4px 8px #d1d9e6, inset -4px -4px 8px #ffffff",
                  border: "none",
                  color: "#2d3748",
                }}
                onFocus={(e) => {
                  e.target.style.boxShadow =
                    "inset 6px 6px 12px #d1d9e6, inset -6px -6px 12px #ffffff, 0 0 0 2px #5b8bf7";
                }}
                onBlur={(e) => {
                  e.target.style.boxShadow = digit
                    ? "inset 4px 4px 8px #d1d9e6, inset -4px -4px 8px #ffffff, 0 0 0 2px #5b8bf7"
                    : "inset 4px 4px 8px #d1d9e6, inset -4px -4px 8px #ffffff";
                }}
              />
            ))}
          </div>

          {/* Error Message */}
          {error && (
            <p
              className="text-sm px-3 py-2 rounded-lg mb-4"
              style={{
                color: "#e53e3e",
                background: "#fff5f5",
                border: "1px solid #feb2b2",
              }}
            >
              {error}
            </p>
          )}

          {/* Verify Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 text-sm font-semibold transition-all mb-4"
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
            {loading ? "Verifying..." : "Verify OTP"}
          </button>

          {/* Resend Section */}
          <div className="text-center">
            {canResend ? (
              <button
                type="button"
                onClick={handleResend}
                disabled={resending}
                className="inline-flex items-center gap-2 text-sm font-medium"
                style={{
                  color: resending ? "#a0aec0" : "#5b8bf7",
                  background: "none",
                  border: "none",
                  cursor: resending ? "not-allowed" : "pointer",
                }}
              >
                <RefreshCw size={14} className={resending ? "animate-spin" : ""} />
                {resending ? "Resending..." : "Resend OTP"}
              </button>
            ) : (
              <p className="text-sm" style={{ color: "#718096" }}>
                Resend OTP in{" "}
                <span className="font-medium" style={{ color: "#2d3748" }}>
                  {resendTimer}s
                </span>
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerifyOTP;
