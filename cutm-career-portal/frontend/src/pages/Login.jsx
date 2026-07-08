import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    otp: "",
  });

  const [loading, setLoading] = useState(false);
  const [otpStep, setOtpStep] = useState(false);
  const [savedEmail, setSavedEmail] = useState("");

  const BASE_URL = import.meta.env.VITE_API_URL || "https://talentry-backend.onrender.com/";

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const sendOtp = async () => {
    const res = await axios.post(`${BASE_URL}/api/users/login-step1`, {
      email: formData.email,
      password: formData.password,
    });

    setSavedEmail(formData.email);
    setOtpStep(true);

    toast.success("OTP generated successfully ✅");
    toast.info(`Test OTP: ${res.data.otp}`, {
      autoClose: 10000,
    });
  };

  const handleLoginStep1 = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await sendOtp();
    } catch (err) {
      const msg = err?.response?.data?.message || "Login failed";
      toast.error(msg);
      console.log(err?.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);

    try {
      await sendOtp();
      toast.success("OTP resent successfully ✅");
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to resend OTP";
      toast.error(msg);
      console.log(err?.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    setOtpStep(false);
    setFormData((prev) => ({ ...prev, otp: "" }));
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(`${BASE_URL}/api/users/verify-otp`, {
        email: savedEmail,
        otp: formData.otp,
      });

      console.log("Verify OTP response:", res.data);

      const user = res.data.user || {};
      const token = res.data.token;
      const role = user.role?.toLowerCase().trim();
      const userId = user._id || user.id;

      if (!token) {
        toast.error("Token not received from server");
        return;
      }

      if (!userId) {
        toast.error("User ID not received from server");
        console.log("User object from backend:", user);
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
      localStorage.setItem("userRole", role || "");
      localStorage.setItem("userName", user.name || "");

      toast.success("Login Successful 👍");

      if (role === "student") {
        navigate("/dashboard");
      } else if (role === "admin") {
        navigate("/admin-dashboard");
      } else if (role === "recruiter") {
        navigate("/recruiter-dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      const msg = err?.response?.data?.message || "OTP verification failed";
      toast.error(msg);
      console.log(err?.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <header className="nav">
        <div className="nav-inner">
          <div className="brand" onClick={() => navigate("/")}>
            <div className="logo-dot">
            <img src="/Designer.png" alt="Talentry"/> </div>

            <span className="brand-name">TALENTRY</span>
          </div>

          <div className="nav-actions">
            <button className="ghost" onClick={() => navigate("/login")}>
              Login
            </button>
            <button className="primary" onClick={() => navigate("/register")}>
              Get Started
            </button>
          </div>
        </div>
      </header>

      <div className="login-page">
        <div className="login-left">
          <img
            src="https://i.pinimg.com/1200x/27/b5/47/27b54733c8edf176229120dd68d952e1.jpg"
            alt="Career Growth"
          />
          <p className="quote">"Opportunities don’t happen. You create them."</p>
        </div>

        <div className="login-right">
          <h1>{otpStep ? "Verify OTP" : "Login"}</h1>

          {!otpStep ? (
            <form onSubmit={handleLoginStep1}>
              <input
                name="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />

              <input
                name="password"
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />

              <button type="submit" disabled={loading}>
                {loading ? "Checking..." : "Login"}
              </button>

              <p className="register-text">
                New user?{" "}
                <Link to="/register" className="register-link">
                  Register
                </Link>
              </p>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp}>
              <input
                name="otp"
                type="text"
                placeholder="Enter OTP"
                value={formData.otp}
                onChange={handleChange}
                maxLength={6}
                required
              />

              <button type="submit" disabled={loading}>
                {loading ? "Verifying..." : "Verify OTP"}
              </button>

              <div className="otp-actions">
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={handleResendOtp}
                  disabled={loading}
                >
                  {loading ? "Please wait..." : "Resend OTP"}
                </button>

                <button
                  type="button"
                  className="back-btn"
                  onClick={handleBackToLogin}
                  disabled={loading}
                >
                  Back
                </button>
              </div>

              <p className="register-text">
                OTP sent for <strong>{savedEmail}</strong>
              </p>
            </form>
          )}
        </div>
      </div>
    </>
  );
}

export default Login;