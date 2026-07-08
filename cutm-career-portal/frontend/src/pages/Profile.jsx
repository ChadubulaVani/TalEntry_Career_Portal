import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./Profile.css";

const isValidEmail = (email) => /^\S+@\S+\.\S+$/.test(email);
const isValidPhone = (phone) => !phone || /^[6-9]\d{9}$/.test(phone.trim()); // India 10-digit
const isValidUrl = (url) =>
  !url ||
  /^(https?:\/\/)(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}.*$/.test(url.trim());

function Profile() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    department: "",
    year: "",
    skills: "",
    github: "",
    linkedin: "",
  });

  const [touched, setTouched] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.info("Please login first");
      navigate("/login");
      return;
    }

    const userName = localStorage.getItem("userName") || "";
    const userEmail = localStorage.getItem("userEmail") || "";

    const savedProfile = localStorage.getItem(`profileData_${userEmail}`);

    if (savedProfile) {
      setFormData(JSON.parse(savedProfile));
    } else {
      setFormData({
        fullName: userName,
        email: userEmail,
        phone: "",
        department: "",
        year: "",
        skills: "",
        github: "",
        linkedin: "",
      });
    }
  }, [navigate]);

  const errors = useMemo(() => {
    const e = {};

    // Full Name
    if (!formData.fullName.trim()) e.fullName = "Full name is required";
    else if (formData.fullName.trim().length < 3)
      e.fullName = "Name must be at least 3 characters";

    // Email
    if (!formData.email.trim()) e.email = "Email is required";
    else if (!isValidEmail(formData.email)) e.email = "Enter a valid email";

    // Phone (optional)
    if (!isValidPhone(formData.phone))
      e.phone = "Enter a valid 10-digit phone number";

    // Department (optional but if filled, min length)
    if (formData.department && formData.department.trim().length < 2)
      e.department = "Department looks too short";

    // Year
    if (!formData.year) e.year = "Please select your year";

    // Skills (recommended)
    if (!formData.skills.trim())
      e.skills = "Please add your skills (comma separated)";
    else if (
      formData.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean).length < 2
    )
      e.skills = "Add at least 2 skills (example: React, Node)";

    // URLs (optional)
    if (!isValidUrl(formData.github))
      e.github = "Enter a valid URL (start with http/https)";
    if (!isValidUrl(formData.linkedin))
      e.linkedin = "Enter a valid URL (start with http/https)";

    return e;
  }, [formData]);

  const isFormValid = Object.keys(errors).length === 0;

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleBlur = (e) => {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));
  };

  const showError = (name) => touched[name] && errors[name];

  const handleSave = async (e) => {
    e.preventDefault();
    setTouched({
      fullName: true,
      email: true,
      phone: true,
      department: true,
      year: true,
      skills: true,
      github: true,
      linkedin: true,
    });

    if (!isFormValid) {
      toast.error("Please fix the errors before saving ❌");
      return;
    }

    try {
      setSaving(true);

      // ✅ Temporary: save locally (later replace with backend API)
      const userEmail = localStorage.getItem("userEmail");

      localStorage.setItem(
        `profileData_${userEmail}`,
        JSON.stringify(formData),
      );

      toast.success("Profile saved successfully ✅");
    } catch (err) {
      toast.error("Failed to save profile");
      console.log(err);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setFormData({
      fullName: localStorage.getItem("userName") || "",
      email: localStorage.getItem("userEmail") || "",
      phone: "",
      department: "",
      year: "",
      skills: "",
      github: "",
      linkedin: "",
    });
    setTouched({});
    toast.info("Form cleared");
  };

  return (
    <div className="profile-page">
      <div className="profile-top">
        <div>
          <h1 className="profile-title">👤 My Profile</h1>
          <p className="profile-subtitle">
            Keep your profile updated to get better job matches ✨
          </p>
        </div>

        <div className="profile-top-actions">
          <button className="ghost-btn" onClick={() => navigate("/dashboard")}>
            ⬅ Back
          </button>
        </div>
      </div>

      <form className="profile-card" onSubmit={handleSave}>
        <div className="profile-card-head">
          <div>
            <h2>Basic Details</h2>
            <p>These details help recruiters understand you better.</p>
          </div>

          <div className="status-pill">
            {isFormValid ? "✅ Ready to Save" : "⚠️ Incomplete"}
          </div>
        </div>

        <div className="grid">
          {/* Full Name */}
          <div className="field">
            <label>Full Name *</label>
            <input
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter your full name"
              className={showError("fullName") ? "invalid" : ""}
            />
            {showError("fullName") && (
              <p className="error">{errors.fullName}</p>
            )}
          </div>

          {/* Email */}
          <div className="field">
            <label>Email *</label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter your email"
              className={showError("email") ? "invalid" : ""}
            />
            {showError("email") && <p className="error">{errors.email}</p>}
          </div>

          {/* Phone */}
          <div className="field">
            <label>Phone (optional)</label>
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="10-digit number (India)"
              className={showError("phone") ? "invalid" : ""}
            />
            {showError("phone") && <p className="error">{errors.phone}</p>}
          </div>

          {/* Department */}
          <div className="field">
            <label>Department (optional)</label>
            <input
              name="department"
              value={formData.department}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="BCA / CSE / MECH..."
              className={showError("department") ? "invalid" : ""}
            />
            {showError("department") && (
              <p className="error">{errors.department}</p>
            )}
          </div>

          {/* Year */}
          <div className="field">
            <label>Year *</label>
            <select
              name="year"
              value={formData.year}
              onChange={handleChange}
              onBlur={handleBlur}
              className={showError("year") ? "invalid" : ""}
            >
              <option value="">Select year</option>
              <option value="1st">1st Year</option>
              <option value="2nd">2nd Year</option>
              <option value="3rd">3rd Year</option>
              <option value="4th">4th Year</option>
            </select>
            {showError("year") && <p className="error">{errors.year}</p>}
          </div>

          {/* Skills */}
          <div className="field span-2">
            <label>Skills * (comma separated)</label>
            <input
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="React, Node, MongoDB, HTML, CSS..."
              className={showError("skills") ? "invalid" : ""}
            />
            <p className="hint">
              Tip: add at least 2 skills to strengthen your profile.
            </p>
            {showError("skills") && <p className="error">{errors.skills}</p>}
          </div>

          {/* GitHub */}
          <div className="field">
            <label>GitHub (optional)</label>
            <input
              name="github"
              value={formData.github}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="https://github.com/username"
              className={showError("github") ? "invalid" : ""}
            />
            {showError("github") && <p className="error">{errors.github}</p>}
          </div>

          {/* LinkedIn */}
          <div className="field">
            <label>LinkedIn (optional)</label>
            <input
              name="linkedin"
              value={formData.linkedin}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="https://linkedin.com/in/username"
              className={showError("linkedin") ? "invalid" : ""}
            />
            {showError("linkedin") && (
              <p className="error">{errors.linkedin}</p>
            )}
          </div>
        </div>

        <div className="actions">
          <button type="button" className="secondary" onClick={handleReset}>
            ♻️ Reset
          </button>

          <button
            type="submit"
            className="primary"
            disabled={!isFormValid || saving}
          >
            {saving ? "Saving..." : "💾 Save Profile"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Profile;
