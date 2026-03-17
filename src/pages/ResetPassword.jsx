import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  updatePassword,
  signOut,
} from "firebase/auth";
import { doc, deleteDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { Eye, EyeOff, Lock, ArrowLeft, CheckCircle } from "lucide-react";

/*
  NOTE:
  Firebase does not allow updating a password without the user being signed in.
  This page handles the reset by asking the user to enter their NEW password
  after OTP is verified. Since we cannot sign them in without the old password,
  we use Firebase's sendPasswordResetEmail flow as the actual mechanism,
  which sends a secure reset link to their email.

  For a full custom OTP-to-new-password flow without a backend, you would need
  Firebase Blaze plan + Cloud Functions.

  This implementation:
  1. Verifies OTP was completed (via location state)
  2. Cleans up Firestore OTP document
  3. Sends Firebase's secure password reset email
  4. Shows success state with instructions
*/

import { sendPasswordResetEmail } from "firebase/auth";

const ResetPassword = () => {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const otpVerified = location.state?.otpVerified;

  // Guard — must come from VerifyOTP page
  useEffect(() => {
    if (!email || !otpVerified) {
      navigate("/forgot-password");
    }
  }, [email, otpVerified, navigate]);

  const handleSendReset = async () => {
    setLoading(true);
    setError("");

    try {
      // Verify OTP was marked as verified in Firestore
      const otpDoc = await getDoc(doc(db, "otps", email));
      if (!otpDoc.exists() || !otpDoc.data().verified) {
        setError("OTP verification expired. Please start again.");
        setLoading(false);
        navigate("/forgot-password");
        return;
      }

      // Send Firebase password reset email
      await sendPasswordResetEmail(auth, email);

      // Clean up OTP document
      await deleteDoc(doc(db, "otps", email));

      setSent(true);
    } catch (err) {
      console.error(err);
      if (err.code === "auth/user-not-found") {
        setError("No account found with this email address.");
      } else {
        setError("Failed to send reset email. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Auto-trigger the reset email on page load
  useEffect(() => {
    if (email && otpVerified && !sent) {
      handleSendReset();
    }
  }, []);

  // Success State
  if (sent) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4"
        style={{ backgroundColor: "#f0f4f8" }}
      >
        <div
          className="w-full max-w-md p-8 text-center"
          style={{
            background: "#e8edf2",
            borderRadius: "20px",
            boxShadow: "8px 8px 16px #d1d9e6, -8px -8px 16px #ffffff",
          }}
        >
          {/* Success Icon */}
          <div
            className="inline-flex items-center justify-center w-20 h-20 mb-6"
            style={{
              background: "#e8edf2",
              borderRadius: "50%",
              boxShadow: "8px 8px 16px #d1d9e6, -8px -8px 16px #ffffff",
            }}
          >
            <CheckCircle size={36} color="#48bb78" />
          </div>

          <h1
            className="text-2xl font-bold mb-2"
            style={{ color: "#2d3748" }}
          >
            Identity Verified
          </h1>

          <p className="text-sm mb-6" style={{ color: "#718096" }}>
            Your OTP was verified successfully. A secure password reset link
            has been sent to{" "}
            <span className="font-medium" style={{ color: "#2d3748" }}>
              {email}
            </span>
            . Open that email and click the link to set your new password.
          </p>

          {/* Steps */}
          <div
            className="text-left p-4 mb-6 space-y-3"
            style={{
              background: "#e8edf2",
              borderRadius: "12px",
              boxShadow:
                "inset 4px 4px 8px #d1d9e6, inset -4px -4px 8px #ffffff",
            }}
          >
            {[
              "Open your email inbox",
              'Find the email from ServeX / Firebase',
              'Click "Reset Password" link',
              "Enter and confirm your new password",
            ].map((step, i) => (
              <div key={i} className="flex items-center gap-3">
                <div
                  className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: "#5b8bf7" }}
                >
                  {i + 1}
                </div>
                <span className="text-sm" style={{ color: "#2d3748" }}>
                  {step}
                </span>
              </div>
            ))}
          </div>

          <button
            onClick={() => navigate("/login")}
            className="w-full py-3 text-sm font-semibold transition-all"
            style={{
              background: "linear-gradient(145deg, #6b9bf8, #4a7af6)",
              borderRadius: "12px",
              boxShadow: "6px 6px 12px #d1d9e6, -6px -6px 12px #ffffff",
              color: "#ffffff",
              border: "none",
              cursor: "pointer",
            }}
          >
            Back to Login
          </button>

          <p className="text-xs mt-4" style={{ color: "#a0aec0" }}>
            Did not receive the email? Check your spam folder or{" "}
            <button
              onClick={() => navigate("/forgot-password")}
              style={{
                color: "#5b8bf7",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "inherit",
              }}
            >
              try again
            </button>
            .
          </p>
        </div>
      </div>
    );
  }

  // Loading / Error State
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: "#f0f4f8" }}
    >
      <div
        className="w-full max-w-md p-8 text-center"
        style={{
          background: "#e8edf2",
          borderRadius: "20px",
          boxShadow: "8px 8px 16px #d1d9e6, -8px -8px 16px #ffffff",
        }}
      >
        {/* Lock Icon */}
        <div
          className="inline-flex items-center justify-center w-20 h-20 mb-6"
          style={{
            background: "#e8edf2",
            borderRadius: "50%",
            boxShadow: "8px 8px 16px #d1d9e6, -8px -8px 16px #ffffff",
          }}
        >
          <Lock size={32} color="#5b8bf7" />
        </div>

        <h1 className="text-2xl font-bold mb-2" style={{ color: "#2d3748" }}>
          {loading ? "Processing..." : "Reset Password"}
        </h1>

        <p className="text-sm mb-6" style={{ color: "#718096" }}>
          {loading
            ? "Sending your password reset link..."
            : "Preparing your password reset."}
        </p>

        {/* Loading Spinner */}
        {loading && (
          <div className="flex justify-center mb-6">
            <div
              className="w-10 h-10 rounded-full border-4 animate-spin"
              style={{
                borderColor: "#d1d9e6",
                borderTopColor: "#5b8bf7",
              }}
            />
          </div>
        )}

        {/* Error */}
        {error && (
          <div>
            <p
              className="text-sm px-4 py-3 rounded-lg mb-4"
              style={{
                color: "#e53e3e",
                background: "#fff5f5",
                border: "1px solid #feb2b2",
              }}
            >
              {error}
            </p>
            <button
              onClick={() => navigate("/forgot-password")}
              className="inline-flex items-center gap-2 text-sm"
              style={{
                color: "#5b8bf7",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              <ArrowLeft size={14} />
              Start again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
