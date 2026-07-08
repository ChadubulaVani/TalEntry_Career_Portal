import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import "./Applications.css";

function Applications() {
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [appliedIds, setAppliedIds] = useState(() => {
    const saved = localStorage.getItem("appliedJobs");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.info("Please login first");
      navigate("/login");
      return;
    }

    fetchJobs();
  }, [navigate]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/api/jobs`);
      setJobs(res.data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast.error("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  const appliedJobs = useMemo(() => {
    const map = new Map(jobs.map((j) => [j._id, j]));

    return appliedIds.map((id) => {
      const found = map.get(id);
      return (
        found || {
          _id: id,
          role: "Job",
          company: "Unknown",
          location: "",
          description: "Details not available",
          skills: [],
          type: "",
          stipend: "",
        }
      );
    });
  }, [jobs, appliedIds]);

  const withdraw = (id) => {
    const next = appliedIds.filter((x) => x !== id);
    setAppliedIds(next);
    localStorage.setItem("appliedJobs", JSON.stringify(next));
    toast.success("Application withdrawn ✅");
  };

  const clearAll = () => {
    setAppliedIds([]);
    localStorage.setItem("appliedJobs", JSON.stringify([]));
    toast.info("Cleared all applications");
  };

  return (
    <div className="apps-page">
      <div className="apps-header">
        <div>
          <h1 className="apps-title">📌 My Applications</h1>
          <p className="apps-subtitle">
            Track jobs you applied for and manage your applications.
          </p>
        </div>

        <div className="apps-head-actions">
          <button className="apps-back" onClick={() => navigate("/dashboard")}>
            ⬅ Back
          </button>
          {appliedIds.length > 0 && (
            <button className="apps-clear" onClick={clearAll}>
              🧹 Clear All
            </button>
          )}
        </div>
      </div>

      <div className="apps-summary">
        <div className="sum-card">
          <div className="sum-big">{appliedIds.length}</div>
          <div className="sum-text">Total Applications</div>
        </div>
        <div className="sum-card">
          <div className="sum-big">✅</div>
          <div className="sum-text">Applied Status</div>
        </div>
        <div className="sum-card">
          <div className="sum-big">⏳</div>
          <div className="sum-text">Shortlisted/Rejected (later)</div>
        </div>
      </div>

      {loading ? (
        <div className="apps-empty">
          <h3>Loading applications...</h3>
        </div>
      ) : appliedJobs.length > 0 ? (
        <div className="apps-grid">
          {appliedJobs.map((job) => (
            <div className="apps-card" key={job._id}>
              <div className="apps-top">
                <div>
                  <h3 className="job-title">{job.role || "Job Role"}</h3>
                  <p className="job-company">
                    {job.company || "Unknown Company"}
                    {job.location ? ` • ${job.location}` : ""}
                  </p>
                </div>

                <div className="status-pill">APPLIED</div>
              </div>

              {job.description && <p className="job-desc">{job.description}</p>}

              {job.skills?.length > 0 && (
                <div className="skills">
                  {job.skills.map((s, index) => (
                    <span className="skill" key={index}>
                      {s}
                    </span>
                  ))}
                </div>
              )}

              <div className="apps-actions">
                <button
                  className="details-btn"
                  onClick={() => navigate(`/jobs/${job._id}`)}
                >
                  View Details
                </button>

                <button
                  className="apps-btn danger"
                  onClick={() => withdraw(job._id)}
                >
                  Withdraw
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="apps-empty">
          <h3>No applications yet 😕</h3>
          <p>Go to Jobs page and apply for a role.</p>
          <button className="go-jobs" onClick={() => navigate("/jobs")}>
            💼 Go to Jobs
          </button>
        </div>
      )}
    </div>
  );
}

export default Applications;