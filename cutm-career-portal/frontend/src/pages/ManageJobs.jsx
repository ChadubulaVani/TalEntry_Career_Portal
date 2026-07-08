import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "./ManageJobs.css";

const initialForm = {
  company: "",
  role: "",
  description: "",
  location: "",
  deadline: "",
};

function ManageJobs() {
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState(initialForm);
  const [editingJobId, setEditingJobId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");

    if (!token) {
      toast.info("Please login first");
      navigate("/login");
      return;
    }

    if (role !== "admin") {
      toast.error("Access denied");
      navigate("/login");
      return;
    }

    fetchJobs();
  }, [navigate]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await axios.get(`${BASE_URL}/api/admin/jobs`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setJobs(res.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const resetForm = () => {
    setFormData(initialForm);
    setEditingJobId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.company.trim() ||
      !formData.role.trim() ||
      !formData.deadline
    ) {
      toast.error("Company, role and deadline are required");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (editingJobId) {
        const res = await axios.put(
          `${BASE_URL}/api/admin/jobs/${editingJobId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setJobs((prev) =>
          prev.map((job) => (job._id === editingJobId ? res.data.job : job))
        );

        toast.success("Job updated successfully");
      } else {
        const res = await axios.post(`${BASE_URL}/api/admin/jobs`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setJobs((prev) => [res.data.job, ...prev]);
        toast.success("Job added successfully");
      }

      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save job");
    }
  };

  const handleEdit = (job) => {
    setFormData({
      company: job.company || "",
      role: job.role || "",
      description: job.description || "",
      location: job.location || "",
      deadline: job.deadline ? job.deadline.split("T")[0] : "",
    });

    setEditingJobId(job._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (jobId) => {
    const confirmed = window.confirm("Are you sure you want to delete this job?");
    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(`${BASE_URL}/api/admin/jobs/${jobId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setJobs((prev) => prev.filter((job) => job._id !== jobId));
      toast.success("Job deleted successfully");

      if (editingJobId === jobId) {
        resetForm();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete job");
    }
  };

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      return (
        job.company.toLowerCase().includes(search.toLowerCase()) ||
        job.role.toLowerCase().includes(search.toLowerCase()) ||
        job.location.toLowerCase().includes(search.toLowerCase())
      );
    });
  }, [jobs, search]);

  return (
    <div className="manage-jobs-page">
      <div className="manage-jobs-header">
        <div>
          <h1>💼 Manage Jobs</h1>
          <p>Add, edit, search and delete job postings from the portal.</p>
        </div>

        <button className="back-btn" onClick={() => navigate("/admin-dashboard")}>
          ⬅ Back to Dashboard
        </button>
      </div>

      <div className="job-form-card">
        <h2>{editingJobId ? "Edit Job" : "Add New Job"}</h2>

        <form className="job-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="company"
            placeholder="Company Name *"
            value={formData.company}
            onChange={handleChange}
          />

          <input
            type="text"
            name="role"
            placeholder="Job Role *"
            value={formData.role}
            onChange={handleChange}
          />

          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
          />

          <input
            type="date"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
          />

          <textarea
            name="description"
            placeholder="Job Description"
            rows="4"
            value={formData.description}
            onChange={handleChange}
          />

          <div className="job-form-actions">
            <button type="submit" className="save-btn">
              {editingJobId ? "Update Job" : "Add Job"}
            </button>

            <button type="button" className="cancel-btn" onClick={resetForm}>
              Clear
            </button>
          </div>
        </form>
      </div>

      <div className="jobs-toolbar">
        <input
          type="text"
          placeholder="Search by company, role or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="jobs-empty">Loading jobs...</div>
      ) : filteredJobs.length === 0 ? (
        <div className="jobs-empty">No jobs found.</div>
      ) : (
        <div className="jobs-list">
          {filteredJobs.map((job) => (
            <div className="job-card" key={job._id}>
              <div className="job-card-top">
                <div>
                  <h3>{job.role}</h3>
                  <p>
                    <strong>{job.company}</strong> • {job.location || "N/A"}
                  </p>
                </div>
                <span className="job-deadline">
                  Deadline:{" "}
                  {job.deadline
                    ? new Date(job.deadline).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>

              <p>
                <b>Description:</b> {job.description || "N/A"}
              </p>

              <div className="job-card-actions">
                <button className="edit-btn" onClick={() => handleEdit(job)}>
                  Edit
                </button>
                <button className="delete-btn" onClick={() => handleDelete(job._id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ManageJobs;