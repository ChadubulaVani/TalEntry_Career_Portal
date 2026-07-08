import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./Resume.css";

const emptyResume = {
  fullName: "",
  email: "",
  phone: "",
  location: "",
  summary: "",
  skills: "",
  education: "",
  experience: "",
  projects: "",
  certifications: "",
  achievements: "",
  interests: "",
  languages: "",
  links: "",
};

const isValidEmail = (email) => /^\S+@\S+\.\S+$/.test(email);
const isValidPhone = (phone) => !phone || /^[6-9]\d{9}$/.test(phone.trim()); // India (optional)
const isValidUrl = (url) =>
  !url ||
  /^(https?:\/\/)(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}.*$/.test(url.trim());

function Resume() {
  const navigate = useNavigate();
  const resumeRef = useRef(null);

  const [data, setData] = useState(emptyResume);
  const [downloading, setDownloading] = useState(false);
  const [touched, setTouched] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.info("Please login first");
      navigate("/login");
      return;
    }

    const userEmail = localStorage.getItem("userEmail") || "";
    const userName = localStorage.getItem("userName") || "";

    const savedResume = localStorage.getItem(`resumeData_${userEmail}`);

    if (savedResume) {
      setData(JSON.parse(savedResume));
      return;
    }

    const profile = localStorage.getItem(`profileData_${userEmail}`);

    if (profile) {
      const p = JSON.parse(profile);

      setData({
        ...emptyResume,
        fullName: p.fullName || userName,
        email: p.email || userEmail,
        phone: p.phone || "",
        skills: p.skills || "",
        links: [p.github, p.linkedin].filter(Boolean).join(" | "),
      });
    } else {
      setData({
        ...emptyResume,
        fullName: userName,
        email: userEmail,
      });
    }
  }, [navigate]);

  const errors = useMemo(() => {
    const e = {};

    // Required
    if (!data.fullName.trim()) e.fullName = "Full name is required";
    else if (data.fullName.trim().length < 3)
      e.fullName = "Name must be at least 3 characters";

    if (!data.email.trim()) e.email = "Email is required";
    else if (!isValidEmail(data.email)) e.email = "Enter a valid email";

    // Optional phone but validate if filled
    if (!isValidPhone(data.phone))
      e.phone = "Enter a valid 10-digit phone number";

    // Summary: recommended
    if (!data.summary.trim()) e.summary = "Summary is required (2–3 lines)";
    else if (data.summary.trim().length < 40)
      e.summary = "Career Objective should be at least 40 characters";

    // Skills: at least 3
    const skillsList = data.skills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (skillsList.length < 3)
      e.skills = "Add at least 3 skills (comma separated)";

    // Education
    if (!data.education.trim()) e.education = "Education details are required";
    else if (data.education.trim().length < 20)
      e.education = "Education should be at least 20 characters";

    if (!data.experience.trim())
      e.experience = "Experience details are required";
    else if (data.experience.trim().length < 20)
      e.experience = "Experience should be at least 20 characters";

    // Projects
    if (!data.projects.trim()) e.projects = "Add at least 1 project";
    else if (data.projects.trim().length < 30)
      e.projects = "Project description should be at least 30 characters";

    if (!data.certifications.trim())
      e.certifications = "Certification details are required";
    else if (data.certifications.trim().length < 10)
      e.certifications = "Certifications should be at least 10 characters";

    if (!data.achievements.trim())
      e.achievements = "Achievement details are required";
    else if (data.achievements.trim().length < 10)
      e.achievements = "Achievements should be at least 10 characters";

    if (!data.interests.trim()) e.interests = "Interests are required";
    else if (data.interests.trim().length < 10)
      e.interests = "Interests should be at least 10 characters";

    if (!data.languages.trim()) e.languages = "Languages are required";
    else if (data.languages.trim().length < 3)
      e.languages = "Languages should be at least 3 characters";

    // Links (optional but validate if looks like URL)
    // If user provides links separated by |, validate each URL if starts with http
    if (data.links.trim()) {
      const parts = data.links
        .split("|")
        .map((x) => x.trim())
        .filter(Boolean);
      for (const part of parts) {
        if (part.startsWith("http") && !isValidUrl(part)) {
          e.links = "Links must be valid URLs (start with http/https)";
          break;
        }
      }
    }

    return e;
  }, [data]);

  const isFormValid = Object.keys(errors).length === 0;

  const showError = (name) => touched[name] && errors[name];

  const handleChange = (e) => {
    setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleBlur = (e) => {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));
  };

  const handleSave = () => {
    // mark all touched so errors show if any
    setTouched({
      fullName: true,
      email: true,
      phone: true,
      summary: true,
      skills: true,
      education: true,
      experience: true,
      projects: true,
      certifications: true,
      achievements: true,
      interests: true,
      languages: true,
      links: true,
      location: true,
    });

    if (!isFormValid) {
      toast.error("Please fix the errors before saving ❌");
      return;
    }

    const userEmail = localStorage.getItem("userEmail");

    localStorage.setItem(`resumeData_${userEmail}`, JSON.stringify(data));
    toast.success("Resume saved ✅");
  };

  const handleReset = () => {
    setData({
      ...emptyResume,
      fullName: localStorage.getItem("userName") || "",
      email: localStorage.getItem("userEmail") || "",
    });

    setTouched({});
    toast.info("Cleared resume form");
  };

  const downloadPDF = async () => {
    setTouched({
      fullName: true,
      email: true,
      phone: true,
      summary: true,
      skills: true,
      education: true,
      experience: true,
      projects: true,
      certifications: true,
      achievements: true,
      interests: true,
      languages: true,
      links: true,
      location: true,
    });

    if (!isFormValid) {
      toast.error("Please complete required fields before downloading ❌");
      return;
    }

    if (!resumeRef.current) return;

    setDownloading(true);
    toast.info("Generating PDF...");

    try {
      const canvas = await html2canvas(resumeRef.current, {
        scale: 2,
        useCORS: true,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let position = 0;

      if (imgHeight <= pdfHeight) {
        pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      } else {
        let heightLeft = imgHeight;
        while (heightLeft > 0) {
          pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
          heightLeft -= pdfHeight;
          if (heightLeft > 0) {
            pdf.addPage();
            position -= pdfHeight;
          }
        }
      }

      pdf.save(
        `${(data.fullName || "resume").replace(/\s+/g, "_").trim()}.pdf`,
      );
      toast.success("Downloaded ✅");
    } catch (err) {
      console.log(err);
      toast.error("Failed to download PDF");
    } finally {
      setDownloading(false);
    }
  };

  const skillsList = data.skills
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <div className="resume-page">
      {/* Header */}
      <div className="resume-header">
        <div>
          <h1 className="resume-title">🧾 Resume Builder</h1>
          <p className="resume-subtitle">
            Fill details on the left, preview on the right, then download as
            PDF.
          </p>
        </div>

        <button className="resume-back" onClick={() => navigate("/dashboard")}>
          ⬅ Back
        </button>
      </div>

      <div className="resume-layout">
        {/* Left Form */}
        <div className="resume-form">
          <div className="form-card">
            <h2>Resume Details</h2>
            <p className="muted">
              Fields marked important must be filled before download.
            </p>

            <div className="grid">
              <div className="field">
                <label>Full Name *</label>
                <input
                  name="fullName"
                  value={data.fullName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Your name"
                  className={showError("fullName") ? "invalid" : ""}
                />
                {showError("fullName") && (
                  <p className="error">{errors.fullName}</p>
                )}
              </div>

              <div className="field">
                <label>Email *</label>
                <input
                  name="email"
                  type="email"
                  value={data.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="yourmail@gmail.com"
                  className={showError("email") ? "invalid" : ""}
                />
                {showError("email") && <p className="error">{errors.email}</p>}
              </div>

              <div className="field">
                <label>Phone (optional)</label>
                <input
                  name="phone"
                  value={data.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="10-digit phone"
                  className={showError("phone") ? "invalid" : ""}
                />
                {showError("phone") && <p className="error">{errors.phone}</p>}
              </div>

              <div className="field">
                <label>Location</label>
                <input
                  name="location"
                  value={data.location}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Chennai, India"
                />
              </div>

              <div className="field span-2">
                <label>Career Objective *</label>
                <textarea
                  name="summary"
                  value={data.summary}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="2-3 lines about you..."
                  rows={3}
                  className={showError("summary") ? "invalid" : ""}
                />
                {showError("summary") && (
                  <p className="error">{errors.summary}</p>
                )}
              </div>

              <div className="field span-2">
                <label>Skills * (comma separated)</label>
                <input
                  name="skills"
                  value={data.skills}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="React, Node, MongoDB, HTML, CSS"
                  className={showError("skills") ? "invalid" : ""}
                />
                {showError("skills") && (
                  <p className="error">{errors.skills}</p>
                )}
              </div>

              <div className="field span-2">
                <label>Education *</label>
                <textarea
                  name="education"
                  value={data.education}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="College, Degree, Year, CGPA..."
                  rows={3}
                  className={showError("education") ? "invalid" : ""}
                />
                {showError("education") && (
                  <p className="error">{errors.education}</p>
                )}
              </div>

              <div className="field span-2">
                <label>Experience *</label>
                <textarea
                  name="experience"
                  value={data.experience}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Company, Role, Duration...."
                  rows={3}
                  className={showError("experience") ? "invalid" : ""}
                />
                {showError("experience") && (
                  <p className="error">{errors.experience}</p>
                )}
              </div>

              <div className="field span-2">
                <label>Projects *</label>
                <textarea
                  name="projects"
                  value={data.projects}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Project name - what you built - tech used..."
                  rows={4}
                  className={showError("projects") ? "invalid" : ""}
                />
                {showError("projects") && (
                  <p className="error">{errors.projects}</p>
                )}
              </div>

              <div className="field span-2">
                <label>Certifications *</label>
                <textarea
                  name="certifications"
                  value={data.certifications}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Certificate Name, Date of issue, Issuing Organisaation...."
                  rows={2}
                  className={showError("certifications") ? "invalid" : ""}
                />
                {showError("certifications") && (
                  <p className="error">{errors.certifications}</p>
                )}
              </div>

              <div className="field span-2">
                <label>Achievements *</label>
                <textarea
                  name="achievements"
                  value={data.achievements}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Achievement Name, Event Name..."
                  rows={2}
                  className={showError("achievemnets") ? "invalid" : ""}
                />
                {showError("achievements") && (
                  <p className="error">{errors.achievements}</p>
                )}
              </div>

              <div className="field span-2">
                <label>Interests *</label>
                <textarea
                  name="interests"
                  value={data.interests}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="interests"
                  rows={1}
                  className={showError("interests") ? "invalid" : ""}
                />
                {showError("interests") && (
                  <p className="error">{errors.interests}</p>
                )}
              </div>

              <div className="field span-2">
                <label>Languages *</label>
                <textarea
                  name="languages"
                  value={data.languages}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="English, Hindi, Telugu, Tamil...."
                  rows={2}
                  className={showError("languages") ? "invalid" : ""}
                />
                {showError("languages") && (
                  <p className="error">{errors.languages}</p>
                )}
              </div>

              <div className="field span-2">
                <label>Links (optional)</label>
                <input
                  name="links"
                  value={data.links}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="https://linkedin... | https://github..."
                  className={showError("links") ? "invalid" : ""}
                />
                {showError("links") && <p className="error">{errors.links}</p>}
              </div>
            </div>

            <div className="actions">
              <button className="secondary" type="button" onClick={handleReset}>
                ♻️ Reset
              </button>
              <button className="secondary" type="button" onClick={handleSave}>
                💾 Save
              </button>
              <button
                className="primary"
                type="button"
                onClick={downloadPDF}
                disabled={!isFormValid || downloading}
              >
                {downloading ? "Downloading..." : "⬇️ Download PDF"}
              </button>
            </div>
          </div>
        </div>

        {/* Right Preview */}
        <div className="resume-preview-wrap">
          <div className="preview-card">
            <div className="preview-label">
              Live Preview {isFormValid ? "✅" : "⚠️"}
            </div>

            <div className="resume-paper" ref={resumeRef}>
              <div className="rp-header">
                <div>
                  <h2 className="rp-name">{data.fullName || "Your Name"}</h2>
                  <p className="rp-contact">
                    {(data.email && `📧 ${data.email}`) ||
                      "📧 yourmail@gmail.com"}{" "}
                    {data.phone ? ` • 📞 ${data.phone}` : ""}{" "}
                    {data.location ? ` • 📍 ${data.location}` : ""}
                  </p>
                  {data.links && <p className="rp-links">🔗 {data.links}</p>}
                </div>
              </div>

              {data.summary && (
                <section className="rp-section">
                  <h3>Career Objective</h3>
                  <p>{data.summary}</p>
                </section>
              )}

              {data.education && (
                <section className="rp-section">
                  <h3>Education</h3>
                  <p style={{ whiteSpace: "pre-line" }}>{data.education}</p>
                </section>
              )}

              {data.experience && (
                <section className="rp-section">
                  <h3>Experience</h3>
                  <p style={{ whiteSpace: "pre-line" }}>{data.experience}</p>
                </section>
              )}

              {data.projects && (
                <section className="rp-section">
                  <h3>Projects</h3>
                  <p style={{ whiteSpace: "pre-line" }}>{data.projects}</p>
                </section>
              )}

              {skillsList.length > 0 && (
                <section className="rp-section">
                  <h3>Skills</h3>
                  <div className="rp-skills">
                    {skillsList.map((s) => (
                      <span className="rp-skill" key={s}>
                        {s}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {data.certifications && (
                <section className="rp-section">
                  <h3>Certifications</h3>
                  <p style={{ whiteSpace: "pre-line" }}>
                    {data.certifications}
                  </p>
                </section>
              )}

              {data.achievements && (
                <section className="rp-section">
                  <h3>Achievements</h3>
                  <p style={{ whiteSpace: "pre-line" }}>{data.achievements}</p>
                </section>
              )}

              {data.interests && (
                <section className="rp-section">
                  <h3>Interests</h3>
                  <p style={{ whiteSpace: "pre-line" }}>{data.interests}</p>
                </section>
              )}

              {data.languages && (
                <section className="rp-section">
                  <h3>Languages</h3>
                  <p style={{ whiteSpace: "pre-line" }}>{data.languages}</p>
                </section>
              )}

              {!data.summary &&
                !data.skills &&
                !data.education &&
                !data.projects && (
                  <div className="rp-empty">
                    Start filling the form to see your resume preview ✨
                  </div>
                )}
            </div>
          </div>

          <div className="note">
            ✅ Download is enabled only when required fields are valid.
          </div>
        </div>
      </div>
    </div>
  );
}

export default Resume;
