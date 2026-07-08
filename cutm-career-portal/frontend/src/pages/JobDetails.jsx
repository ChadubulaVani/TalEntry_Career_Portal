import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import "./JobDetails.css";

function JobDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  const [appliedIds, setAppliedIds] = useState(() => {
    const saved = localStorage.getItem("appliedJobs");
    return saved ? JSON.parse(saved) : [];
  });

  const BASE_URL = import.meta.env.VITE_API_URL || "https://talentry-backend.onrender.com/";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.info("Please login first");
      navigate("/login");
      return;
    }

    fetchJob();
  }, [navigate, id]);

  const fetchJob = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/api/jobs/${id}`);
      setJob(res.data);
    } catch (error) {
      console.error("Fetch job details error:", error);
      toast.error("Failed to load job details");
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!job) return;

    const studentId = localStorage.getItem("userId");
    const role = localStorage.getItem("userRole");

    if (!studentId || studentId === "undefined") {
      toast.error("Student ID not found. Please login again.");
      return;
    }

    if (role !== "student") {
      toast.error("Only students can apply for jobs.");
      return;
    }

    if (appliedIds.includes(job._id)) {
      toast.info("You already applied for this job ✅");
      return;
    }

    try {
      const res = await axios.post(`${BASE_URL}/api/jobs/apply`, {
        studentId,
        jobId: job._id,
      });

      const next = [...appliedIds, job._id];
      setAppliedIds(next);
      localStorage.setItem("appliedJobs", JSON.stringify(next));

      toast.success(res.data?.message || "Applied successfully 🎉");
    } catch (error) {
      console.error("Apply error:", error);
      console.error("Apply error response:", error?.response?.data);

      const backendMessage = error?.response?.data?.message;

      if (backendMessage === "You already applied for this job") {
        const next = appliedIds.includes(job._id)
          ? appliedIds
          : [...appliedIds, job._id];

        setAppliedIds(next);
        localStorage.setItem("appliedJobs", JSON.stringify(next));
        toast.info("You already applied for this job ✅");
      } else {
        toast.error(backendMessage || "Failed to apply");
      }
    }
  };

  const formatPostedDate = (createdAt) => {
    if (!createdAt) return "Recently posted";
    return new Date(createdAt).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="job-details-page">
        <div className="job-details-card">
          <h2>Loading job details...</h2>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="job-details-page">
        <div className="job-details-card">
          <h2>Job not found</h2>
          <p>The job you are looking for does not exist.</p>
          <button className="back-btn" onClick={() => navigate("/jobs")}>
            ⬅ Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  const applied = appliedIds.includes(job._id);

  return (
    <div className="job-details-page">
      <div className="job-details-card">
        <div className="details-header">
          <div>
            <h1>{job.role}</h1>
            <p className="company-line">
              {job.company} • {job.location || "N/A"}
            </p>
          </div>

          <span className="details-type">{job.type || "Full-time"}</span>
        </div>

        <div className="details-meta">
          <span>💰 {job.stipend || "Not disclosed"}</span>
          <span>🕒 {formatPostedDate(job.createdAt)}</span>
          {/* <span>
            📅 Deadline:{" "}
            {job.deadline ? new Date(job.deadline).toLocaleDateString() : "N/A"}
          </span> */}
        </div>

        <section className="details-section">
          <h3>Job Description</h3>
          <p>{job.description || "No description available."}</p>
        </section>

        <section className="details-section">
          <h3>Required Skills</h3>
          <div className="details-skills">
            {job.skills?.length > 0 ? (
              job.skills.map((skill, index) => (
                <span className="details-skill" key={index}>
                  {skill}
                </span>
              ))
            ) : (
              <p>No skills listed.</p>
            )}
          </div>
        </section>

        <section className="details-section">
          <h3>Responsibilities</h3>
          {job.responsibilities?.length > 0 ? (
            <ul>
              {job.responsibilities.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          ) : (
            <p>No responsibilities listed.</p>
          )}
        </section>

        <section className="details-section">
          <h3>Eligibility</h3>
          {job.eligibility?.length > 0 ? (
            <ul>
              {job.eligibility.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          ) : (
            <p>No eligibility details listed.</p>
          )}
        </section>

        <div className="details-actions">
          <button className="back-btn" onClick={() => navigate("/jobs")}>
            ⬅ Back to Jobs
          </button>

          <button
            className="apply-btn-details"
            disabled={applied}
            onClick={handleApply}
          >
            {applied ? "✅ Already Applied" : "🚀 Apply Now"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default JobDetails;