import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import "./Register.css";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    else if (formData.name.trim().length < 3)
      newErrors.name = "Name must be at least 3 characters";

    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";

    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!/^\d{10}$/.test(formData.phone))
      newErrors.phone = "Phone number must be 10 digits";

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const BASE_URL = import.meta.env.VITE_API_URL || "https://talentry-backend.onrender.com";

      const res = await axios.post(`${BASE_URL}/api/users/register`, formData);

      toast.success(res.data.message || "Registration successful ✅");

      setFormData({ name: "", email: "", password: "", phone: "" });
      setErrors({});

      setTimeout(() => navigate("/login"), 800);
    } catch (err) {
      const msg = err?.response?.data?.message || "Registration failed";
      toast.error(msg);
      console.log(err?.response?.data || err);
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

      <div className="register-page">
        <div className="left-side">
          <img
            src="https://i.pinimg.com/736x/54/95/3c/54953ccbea5b0d2072d5562b97ac9b86.jpg"
            alt="Career Growth"
          />
          <p className="quote">
            "Your future is created by what you do today, not tomorrow."
          </p>
        </div>

        <div className="right-side">
          <h1>Student Registration</h1>

          <form onSubmit={handleSubmit}>
            <input
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && <p className="error">{errors.name}</p>}

            <input
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <p className="error">{errors.email}</p>}

            <input
              name="phone"
              type="text"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              maxLength={10}
            />
            {errors.phone && <p className="error">{errors.phone}</p>}

            <input
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && <p className="error">{errors.password}</p>}

            <button type="submit">Register</button>

            <p className="login-text">
              Already registered?{" "}
              <Link to="/login" className="login-link">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}

export default Register;