import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./InterviewPrep.css";

const QUESTIONS = {
  HR: [
    {
      id: "HR1",
      q: "Tell me about yourself.",
      a: "Start with your background, education, skills, and current goal aligned with the role.",
    },
    {
      id: "HR2",
      q: "What are your strengths and weaknesses?",
      a: "Mention 2–3 strengths with examples. For weakness, choose one real but improving area.",
    },
    {
      id: "HR3",
      q: "Why should we hire you?",
      a: "Explain your skills, relevance to job, and how you can add value to the company.",
    },
    {
      id: "HR4",
      q: "Describe a challenge you faced and how you solved it.",
      a: "Use STAR method: explain situation, task, action, and result clearly.",
    },
    {
      id: "HR5",
      q: "Where do you see yourself in 5 years?",
      a: "Talk about growth, leadership, and aligning with company goals.",
    },
    {
      id: "HR6",
      q: "Why do you want this role/company?",
      a: "Show research about company and match with your career goals.",
    },
    {
      id: "HR7",
      q: "How do you handle stress and pressure?",
      a: "Explain calm approach, prioritization, and real-life example.",
    },
    {
      id: "HR8",
      q: "Explain a time you worked in a team.",
      a: "Share teamwork experience using STAR format.",
    },
  ],

  Technical: [
    {
      id: "T1",
      q: "What is React and why is it used?",
      a: "React is a JavaScript library for building UI using reusable components.",
    },
    {
      id: "T2",
      q: "Explain props vs state in React.",
      a: "Props are read-only inputs; state is internal and can change.",
    },
    {
      id: "T3",
      q: "What is useEffect and when do you use it?",
      a: "Used for side effects like API calls, subscriptions, DOM updates.",
    },
    {
      id: "T4",
      q: "Explain REST API and HTTP methods.",
      a: "REST APIs use HTTP methods like GET, POST, PUT, DELETE for CRUD operations.",
    },
    {
      id: "T5",
      q: "What is JWT and how authentication works?",
      a: "JWT is a token-based auth system used to verify users securely.",
    },
    {
      id: "T6",
      q: "What is MongoDB and why is it called NoSQL?",
      a: "MongoDB stores data in JSON-like documents, not tables.",
    },
    {
      id: "T7",
      q: "Explain middleware in Express.",
      a: "Middleware runs between request and response in Express apps.",
    },
    {
      id: "T8",
      q: "What is CORS and why does it occur?",
      a: "CORS is a browser security feature controlling cross-origin requests.",
    },
  ],

  Aptitude: [
    {
      id: "A1",
      q: "If 5 machines make 5 items in 5 minutes, how many minutes for 100 machines to make 100 items?",
      a: "5 minutes (each machine works at same rate).",
    },
    {
      id: "A2",
      q: "A train 120m long runs at 54 km/h. How long to cross a pole?",
      a: "8 seconds.",
    },
    {
      id: "A3",
      q: "Profit of 20% on cost price. Selling price is 600. Find cost price.",
      a: "CP = 500.",
    },
    { id: "A4", q: "Find the next number: 2, 6, 12, 20, 30, ?", a: "42." },
    {
      id: "A5",
      q: "A can do a work in 10 days, B in 15 days. Together?",
      a: "6 days.",
    },
  ],
};

function InterviewPrep() {
  const navigate = useNavigate();

  const [tab, setTab] = useState("HR");
  const [query, setQuery] = useState("");
  const [doneIds, setDoneIds] = useState(() => {
    const saved = localStorage.getItem("prepDoneIds");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.info("Please login first");
      navigate("/login");
      return;
    }
  }, [navigate]);

  useEffect(() => {
    localStorage.setItem("prepDoneIds", JSON.stringify(doneIds));
  }, [doneIds]);

  const list = QUESTIONS[tab];

  const filtered = useMemo(() => {
    return list.filter((item) =>
      item.q.toLowerCase().includes(query.toLowerCase()),
    );
  }, [list, query]);

  const progress = useMemo(() => {
    const total = list.length;
    const done = list.filter((i) => doneIds.includes(i.id)).length;
    return {
      total,
      done,
      percent: total ? Math.round((done / total) * 100) : 0,
    };
  }, [list, doneIds]);

  const toggleDone = (id) => {
    setDoneIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const practiceRandom = () => {
    const notDone = list.filter((i) => !doneIds.includes(i.id));
    const pickFrom = notDone.length ? notDone : list;
    const random = pickFrom[Math.floor(Math.random() * pickFrom.length)];
    toast.info(`🎯 Practice: ${random.q}`);
  };

  const resetTabProgress = () => {
    const tabIds = list.map((i) => i.id);
    setDoneIds((prev) => prev.filter((id) => !tabIds.includes(id)));
    toast.info(`Reset progress for ${tab}`);
  };

  return (
    <div className="prep-page">
      {/* Header */}
      <div className="prep-header">
        <div>
          <h1 className="prep-title">🎤 Interview Prep</h1>
          <p className="prep-subtitle">
            Practice daily, mark completed, and track your progress.
          </p>
        </div>

        <button className="prep-back" onClick={() => navigate("/dashboard")}>
          ⬅ Back
        </button>
      </div>

      {/* Tabs + Progress */}
      <div className="prep-topbar">
        <div className="tabs">
          {["HR", "Technical", "Aptitude"].map((t) => (
            <button
              key={t}
              className={`tab ${tab === t ? "active" : ""}`}
              onClick={() => {
                setTab(t);
                setQuery("");
              }}
            >
              {t === "HR"
                ? "🧑‍💼 HR"
                : t === "Technical"
                  ? "💻 Technical"
                  : "🧠 Aptitude"}
            </button>
          ))}
        </div>

        <div className="progress-box">
          <div className="progress-text">
            <b>{tab}</b> Progress: {progress.done}/{progress.total} (
            {progress.percent}%)
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progress.percent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="prep-controls">
        <div className="search">
          <label>Search</label>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search questions..."
          />
        </div>

        <button className="ctl-btn secondary" onClick={practiceRandom}>
          🎯 Practice Mode
        </button>

        <button className="ctl-btn danger" onClick={resetTabProgress}>
          ♻️ Reset Tab
        </button>
      </div>

      {/* Questions */}
      <div className="q-grid">
        {filtered.map((item) => {
          const done = doneIds.includes(item.id);
          return (
            <div key={item.id} className={`q-card ${done ? "done" : ""}`}>
              <div className="q-top">
                <div className="q-id">{item.id}</div>
                <button
                  className={`mark ${done ? "marked" : ""}`}
                  onClick={() => toggleDone(item.id)}
                >
                  {done ? "✅ Done" : "Mark Done"}
                </button>
              </div>

              <div className="q-text">{item.q}</div>

              <div className="q-answer">
                <b>Answer:</b> {item.a}
              </div>

              <div className="q-hint">
                Tip: Understand the question first, then refer to the provided
                answer and try explaining it in your own words.
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="empty">
          <h3>No questions found 😕</h3>
          <p>Try another keyword.</p>
        </div>
      )}
    </div>
  );
}

export default InterviewPrep;
