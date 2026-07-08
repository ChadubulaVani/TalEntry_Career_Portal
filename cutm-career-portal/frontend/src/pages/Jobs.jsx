import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import "./Jobs.css";

function Jobs() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [locationFilter, setLocationFilter] = useState("All");

  const [appliedIds, setAppliedIds] = useState(() => {
    const saved = localStorage.getItem("appliedJobs");
    return saved ? JSON.parse(saved) : [];
  });

  const BASE_URL = import.meta.env.VITE_API_URL || "https://talentry-backend.onrender.com";

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
      toast.error("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  const locations = useMemo(() => {
    const set = new Set(jobs.map((j) => j.location).filter(Boolean));
    return ["All", ...Array.from(set)];
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const role = (job.role || "").toLowerCase();
      const company = (job.company || "").toLowerCase();
      const skills = Array.isArray(job.skills)
        ? job.skills.join(" ").toLowerCase()
        : "";

      const search = query.toLowerCase();

      const matchesQuery =
        role.includes(search) ||
        company.includes(search) ||
        skills.includes(search);

      const matchesType = typeFilter === "All" ? true : job.type === typeFilter;
      const matchesLocation =
        locationFilter === "All" ? true : job.location === locationFilter;

      return matchesQuery && matchesType && matchesLocation;
    });
  }, [jobs, query, typeFilter, locationFilter]);

  const formatPostedDate = (createdAt) => {
    if (!createdAt) return "Recently posted";
    return new Date(createdAt).toLocaleDateString();
  };

  const handleApply = async (jobId) => {
    try {
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

      if (!jobId) {
        toast.error("Job ID missing.");
        return;
      }

      if (appliedIds.includes(jobId)) {
        toast.info("You already applied for this job ✅");
        return;
      }

      const res = await axios.post(`${BASE_URL}/api/jobs/apply`, {
        studentId,
        jobId,
      });

      const updatedAppliedIds = [...appliedIds, jobId];
      setAppliedIds(updatedAppliedIds);
      localStorage.setItem("appliedJobs", JSON.stringify(updatedAppliedIds));

      toast.success(res.data?.message || "Applied successfully!");
    } catch (err) {
      console.error("Apply error full:", err);
      console.error("Apply error response:", err?.response?.data);

      const backendMessage = err?.response?.data?.message;

      if (backendMessage === "You already applied for this job") {
        if (!appliedIds.includes(jobId)) {
          const updatedAppliedIds = [...appliedIds, jobId];
          setAppliedIds(updatedAppliedIds);
          localStorage.setItem("appliedJobs", JSON.stringify(updatedAppliedIds));
        }
        toast.info("You already applied for this job ✅");
      } else {
        toast.error(backendMessage || "Application failed");
      }
    }
  };

  return (
    <div className="jobs-page">
      <div className="jobs-header">
        <div>
          <h1 className="jobs-title">💼 Jobs</h1>
          <p className="jobs-subtitle">
            Search and apply to the latest opportunities.
          </p>
        </div>

        <button className="jobs-back" onClick={() => navigate("/dashboard")}>
          ⬅ Back to Dashboard
        </button>
      </div>

      <div className="jobs-filters">
        <div className="filter">
          <label>Search</label>
          <input
            placeholder="Search by title, company, skills..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="filter">
          <label>Type</label>
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
            <option value="All">All</option>
            <option value="Internship">Internship</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
          </select>
        </div>

        <div className="filter">
          <label>Location</label>
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
          >
            {locations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        <button
          className="clear-btn"
          onClick={() => {
            setQuery("");
            setTypeFilter("All");
            setLocationFilter("All");
          }}
        >
          ✨ Clear
        </button>
      </div>

      <div className="jobs-count">
        Showing <b>{filteredJobs.length}</b> jobs
      </div>

      {loading ? (
        <div className="empty">
          <h3>Loading jobs...</h3>
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="empty">
          <h3>No jobs found 😕</h3>
          <p>Try changing your filters or search keyword.</p>
        </div>
      ) : (
        <div className="jobs-grid">
          {filteredJobs.map((job) => {
            const applied = appliedIds.includes(job._id);

            return (
              <div key={job._id} className="job-card">
                <div className="job-top">
                  <div>
                    <h3 className="job-title">{job.role}</h3>
                    <p className="job-company">
                      {job.company} •{" "}
                      <span className="job-location">{job.location || "N/A"}</span>
                    </p>
                  </div>

                  <div className="job-type">{job.type || "Full-time"}</div>
                </div>

                <p className="job-desc">{job.description || "No description available"}</p>

                <div className="job-meta">
                  <span className="meta-pill">💰 {job.stipend || "Not disclosed"}</span>
                  {/* <span className="meta-pill">🕒 {formatPostedDate(job.createdAt)}</span> */}
                </div>

                <div className="job-skills">
                  {job.skills?.length > 0 ? (
                    job.skills.map((s, index) => (
                      <span className="skill" key={index}>
                        {s}
                      </span>
                    ))
                  ) : (
                    <span className="skill">No skills listed</span>
                  )}
                </div>

                <div className="job-actions">
                  <button
                    className="apply-btn"
                    disabled={applied}
                    onClick={() => handleApply(job._id)}
                  >
                    {applied ? "✅ Applied" : "🚀 Apply Now"}
                  </button>

                  <button
  className="details-btn"
  onClick={() => {
    console.log("View Details clicked:", job._id);
    navigate(`/jobs/${job._id}`);
  }}
>
  View Details
</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Jobs;