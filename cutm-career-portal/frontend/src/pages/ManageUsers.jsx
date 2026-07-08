import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "./ManageUsers.css";

function ManageUsers() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");

  // ✅ PAGINATION ADDED
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

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

    fetchUsers();
  }, [navigate]);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await axios.get(`${BASE_URL}/api/admin/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsers(res.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.put(
        `${BASE_URL}/api/admin/users/${userId}/role`,
        { role: newRole },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUsers((prev) =>
        prev.map((user) => (user._id === userId ? res.data.user : user))
      );

      toast.success("Role updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update role");
    }
  };

  const handleDelete = async (userId) => {
    const confirmed = window.confirm("Are you sure you want to delete this user?");
    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(`${BASE_URL}/api/admin/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsers((prev) => prev.filter((user) => user._id !== userId));
      toast.success("User deleted successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete user");
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase());

      const matchesRole =
        roleFilter === "All" ? true : user.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  // ✅ RESET PAGE ON FILTER CHANGE
  useEffect(() => {
    setCurrentPage(1);
  }, [search, roleFilter]);

  // ✅ PAGINATION LOGIC
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  return (
    <div className="manage-users-page">
      <div className="manage-users-header">
        <div>
          <h1>👥 Manage Users</h1>
          <p>View, search, filter, update role and delete portal users.</p>
        </div>

        <button className="back-btn" onClick={() => navigate("/admin-dashboard")}>
          ⬅ Back to Dashboard
        </button>
      </div>

      <div className="users-toolbar">
        <div className="toolbar-item">
          <label>Search</label>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="toolbar-item">
          <label>Filter by Role</label>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="All">All</option>
            <option value="student">Student</option>
            <option value="admin">Admin</option>
            <option value="recruiter">Recruiter</option>
          </select>
        </div>

        <button
          className="clear-btn"
          onClick={() => {
            setSearch("");
            setRoleFilter("All");
          }}
        >
          Clear
        </button>
      </div>

      <div className="users-summary">
        Showing <b>{filteredUsers.length}</b> users
      </div>

      {loading ? (
        <div className="users-empty">Loading users...</div>
      ) : filteredUsers.length === 0 ? (
        <div className="users-empty">No users found.</div>
      ) : (
        <>
          <div className="users-table-wrap">
            <table className="users-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Branch</th>
                  <th>Year</th>
                  <th>Joined</th>
                  <th>Update Role</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {currentUsers.map((user) => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`role-badge role-${user.role}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>{user.branch || "N/A"}</td>
                    <td>{user.year || "N/A"}</td>
                    <td>
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td>
                      <select
                        className="role-select"
                        value={user.role}
                        onChange={(e) => handleRoleChange(user._id, e.target.value)}
                      >
                        <option value="student">Student</option>
                        <option value="admin">Admin</option>
                        <option value="recruiter">Recruiter</option>
                      </select>
                    </td>
                    <td>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(user._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ✅ PAGINATION UI */}
          <div className="pagination">
  <button
    className="page-btn"
    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
    disabled={currentPage === 1}
  >
    ← Previous
  </button>

  <div className="page-info">
    <span className="page-current">{currentPage}</span>
    <span className="page-sep">/</span>
    <span className="page-total">{totalPages}</span>
  </div>

  <button
    className="page-btn"
    onClick={() => setCurrentPage((p) => (p < totalPages ? p + 1 : p))}
    disabled={currentPage === totalPages}
  >
    Next →
  </button>
</div>
        </>
      )}
    </div>
  );
}

export default ManageUsers;