import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import taskoraLogo from "../assets/taskora-logo.png";

import {
  getCurrentUser,
  getProjects,
  getTasks,
  logoutUser,
} from "../services/api";

function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const currentUser = await getCurrentUser();
      const projectData = await getProjects();
      const taskData = await getTasks();

      setUser(currentUser);
      setProjects(projectData);
      setTasks(taskData);
    } catch (err) {
      console.error(err);

      if (err.response?.status === 401) {
        localStorage.removeItem("access_token");
        navigate("/login");
        return;
      }

      setError("Unable to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      navigate("/login");
      return;
    }

    loadDashboard();
  }, []);

  const completedTasks = useMemo(
    () => tasks.filter((task) => task.status === "done").length,
    [tasks]
  );

  const pendingTasks = useMemo(
    () => tasks.filter((task) => task.status !== "done").length,
    [tasks]
  );

  const inProgressTasks = useMemo(
    () => tasks.filter((task) => task.status === "in-progress").length,
    [tasks]
  );

  const highPriorityTasks = useMemo(
    () => tasks.filter((task) => task.priority === "high").length,
    [tasks]
  );

  const progress =
    tasks.length === 0
      ? 0
      : Math.round((completedTasks / tasks.length) * 100);

  const getProjectTaskCount = (projectId) => {
    return tasks.filter(
      (task) => task.project_id === projectId
    ).length;
  };

  const getProjectProgress = (projectId) => {
    const projectTasks = tasks.filter(
      (task) => task.project_id === projectId
    );

    if (projectTasks.length === 0) {
      return 0;
    }

    const completed = projectTasks.filter(
      (task) => task.status === "done"
    ).length;

    return Math.round(
      (completed / projectTasks.length) * 100
    );
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.error(err);
    } finally {
      localStorage.removeItem("access_token");
      navigate("/login");
    }
  };

  const getStatusClass = (status) => {
    if (status === "done") return "nx-status-done";
    if (status === "in-progress") return "nx-status-progress";
    return "nx-status-todo";
  };

  const getStatusLabel = (status) => {
    if (status === "done") return "Completed";
    if (status === "in-progress") return "In Progress";
    return "To Do";
  };

  if (loading) {
    return (
      <div className="nx-loading-screen">
        <div className="nx-loading-orbit">
         <div className="nx-orbit-core">
  <img src={taskoraLogo} alt="Taskora" />
</div>
        </div>

        <h2>Preparing your workspace</h2>
        <p>Loading projects, tasks and activity...</p>
      </div>
    );
  }

  return (
    <div className="nx-app-shell">

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside className="nx-sidebar">

        <div className="nx-brand">
        <div className="nx-brand-mark">
  <img src={taskoraLogo} alt="Taskora" />
</div>

          <div>
            <div className="nx-brand-name">
              TASKORA
            </div>

            <div className="nx-brand-subtitle">
              AI WORKSPACE
            </div>
          </div>
        </div>

        <div className="nx-sidebar-section">
          <span className="nx-sidebar-label">
            WORKSPACE
          </span>

          <button className="nx-nav-item nx-nav-active">
            <span className="nx-nav-icon">⌂</span>
            <span>Dashboard</span>
          </button>

          <button
            className="nx-nav-item"
            onClick={() => navigate("/projects")}
          >
            <span className="nx-nav-icon">▦</span>
            <span>Projects & Tasks</span>
          </button>
        </div>

        <div className="nx-sidebar-section">
          <span className="nx-sidebar-label">
            INSIGHTS
          </span>

          <div className="nx-side-stat">
            <span className="nx-side-dot nx-dot-purple"></span>
            <span>Active Projects</span>
            <strong>{projects.length}</strong>
          </div>

          <div className="nx-side-stat">
            <span className="nx-side-dot nx-dot-blue"></span>
            <span>In Progress</span>
            <strong>{inProgressTasks}</strong>
          </div>

          <div className="nx-side-stat">
            <span className="nx-side-dot nx-dot-green"></span>
            <span>Completed</span>
            <strong>{completedTasks}</strong>
          </div>
        </div>

        <div className="nx-sidebar-bottom">

          <div className="nx-profile-mini">

            <div className="nx-avatar">
              {user?.name
                ? user.name.charAt(0).toUpperCase()
                : "U"}
            </div>

            <div className="nx-profile-details">
              <strong>{user?.name || "User"}</strong>
              <span>{user?.email || ""}</span>
            </div>

          </div>

          <button
            className="nx-logout-button"
            onClick={handleLogout}
          >
            Log out
          </button>

        </div>

      </aside>


      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <main className="nx-main">

        {/* TOP BAR */}

        <header className="nx-topbar">

          <div>
            <div className="nx-breadcrumb">
              WORKSPACE / OVERVIEW
            </div>

            <h1>
              Welcome back,{" "}
              <span>{user?.name?.split(" ")[0] || "User"}</span>
            </h1>

            <p>
              Here's what is happening across your workspace.
            </p>
          </div>

          <div className="nx-top-actions">

            <button
              className="nx-outline-button"
              onClick={loadDashboard}
            >
              ↻ Refresh
            </button>

            <button
              className="nx-primary-button"
              onClick={() => navigate("/projects")}
            >
              + Manage Workspace
            </button>

          </div>

        </header>


        {/* ERROR */}

        {error && (
          <div className="nx-alert">
            <span>!</span>
            {error}
          </div>
        )}


        {/* =====================================================
            STATISTICS
        ===================================================== */}

        <section className="nx-stat-grid">

          <div className="nx-stat-card nx-stat-purple">
            <div className="nx-stat-top">
              <span>PROJECTS</span>
              <div className="nx-stat-icon">▦</div>
            </div>

            <strong>{projects.length}</strong>

            <p>
              Active workspaces
            </p>
          </div>


          <div className="nx-stat-card nx-stat-blue">
            <div className="nx-stat-top">
              <span>TOTAL TASKS</span>
              <div className="nx-stat-icon">✓</div>
            </div>

            <strong>{tasks.length}</strong>

            <p>
              All tracked tasks
            </p>
          </div>


          <div className="nx-stat-card nx-stat-green">
            <div className="nx-stat-top">
              <span>COMPLETED</span>
              <div className="nx-stat-icon">✓</div>
            </div>

            <strong>{completedTasks}</strong>

            <p>
              Finished successfully
            </p>
          </div>


          <div className="nx-stat-card nx-stat-orange">
            <div className="nx-stat-top">
              <span>PENDING</span>
              <div className="nx-stat-icon">◷</div>
            </div>

            <strong>{pendingTasks}</strong>

            <p>
              Tasks remaining
            </p>
          </div>

        </section>


        {/* =====================================================
            MAIN GRID
        ===================================================== */}

        <section className="nx-main-grid">

          {/* =================================================
              PROGRESS CARD
          ================================================= */}

          <div className="nx-card nx-progress-card">

            <div className="nx-card-header">
              <div>
                <span className="nx-card-kicker">
                  PRODUCTIVITY
                </span>

                <h2>
                  Workspace Progress
                </h2>

                <p>
                  Completion across all tracked tasks
                </p>
              </div>

              <span className="nx-live-badge">
                LIVE
              </span>
            </div>


            <div className="nx-progress-layout">

              <div
                className="nx-progress-ring"
                style={{
                  "--progress": `${progress}%`,
                }}
              >
                <div className="nx-progress-inner">
                  <strong>{progress}%</strong>
                  <span>complete</span>
                </div>
              </div>


              <div className="nx-progress-info">

                <div className="nx-progress-row">
                  <span>
                    Completed
                  </span>

                  <strong>
                    {completedTasks}
                  </strong>
                </div>

                <div className="nx-progress-row">
                  <span>
                    In progress
                  </span>

                  <strong>
                    {inProgressTasks}
                  </strong>
                </div>

                <div className="nx-progress-row">
                  <span>
                    Pending
                  </span>

                  <strong>
                    {pendingTasks}
                  </strong>
                </div>

                <div className="nx-progress-row">
                  <span>
                    High priority
                  </span>

                  <strong>
                    {highPriorityTasks}
                  </strong>
                </div>

              </div>

            </div>

          </div>


          {/* =================================================
              QUICK ACTIONS
          ================================================= */}

          <div className="nx-card nx-actions-card">

            <div className="nx-card-header">
              <div>
                <span className="nx-card-kicker">
                  QUICK ACCESS
                </span>

                <h2>
                  Get things moving
                </h2>
              </div>
            </div>


            <button
              className="nx-action-tile nx-action-primary"
              onClick={() => navigate("/projects")}
            >
              <span className="nx-action-symbol">
                +
              </span>

              <span>
                <strong>
                  Create & manage
                </strong>

                <small>
                  Projects and tasks
                </small>
              </span>

              <span className="nx-arrow">
                →
              </span>
            </button>


            <button
              className="nx-action-tile"
              onClick={() => navigate("/projects")}
            >
              <span className="nx-action-symbol nx-symbol-ai">
                ✦
              </span>

              <span>
                <strong>
                  Generate with AI
                </strong>

                <small>
                  Turn an idea into tasks
                </small>
              </span>

              <span className="nx-arrow">
                →
              </span>
            </button>

          </div>

        </section>


        {/* =====================================================
            PROJECTS
        ===================================================== */}

        <section className="nx-card nx-projects-card">

          <div className="nx-card-header nx-section-heading">

            <div>
              <span className="nx-card-kicker">
                YOUR WORKSPACE
              </span>

              <h2>
                Projects
              </h2>

              <p>
                Your current initiatives and their progress.
              </p>
            </div>

            <button
              className="nx-text-button"
              onClick={() => navigate("/projects")}
            >
              View all →
            </button>

          </div>


          {projects.length === 0 ? (

            <div className="nx-empty-state">
              <div className="nx-empty-icon">
                +
              </div>

              <h3>
                No projects yet
              </h3>

              <p>
                Create your first project to start organizing
                your work.
              </p>

              <button
                className="nx-primary-button"
                onClick={() => navigate("/projects")}
              >
                Create Project
              </button>
            </div>

          ) : (

            <div className="nx-project-grid">

              {projects.map((project) => {

                const taskCount =
                  getProjectTaskCount(project.id);

                const projectProgress =
                  getProjectProgress(project.id);

                return (
                  <div
                    className="nx-project-card"
                    key={project.id}
                  >

                    <div className="nx-project-icon">
                      {project.name
                        ?.charAt(0)
                        ?.toUpperCase() || "P"}
                    </div>

                    <div className="nx-project-content">

                      <div className="nx-project-title-row">

                        <h3>
                          {project.name}
                        </h3>

                        <span>
                          #{project.id}
                        </span>

                      </div>

                      <p>
                        {project.description ||
                          "No description added yet."}
                      </p>

                      <div className="nx-project-meta">
                        <span>
                          {taskCount} task
                          {taskCount === 1 ? "" : "s"}
                        </span>

                        <span>
                          {projectProgress}% complete
                        </span>
                      </div>

                      <div className="nx-mini-progress">
                        <div
                          style={{
                            width: `${projectProgress}%`,
                          }}
                        ></div>
                      </div>

                    </div>

                  </div>
                );
              })}

            </div>

          )}

        </section>


        {/* =====================================================
            RECENT TASKS + ACCOUNT
        ===================================================== */}

        <section className="nx-bottom-grid">

          {/* RECENT TASKS */}

          <div className="nx-card">

            <div className="nx-card-header">
              <div>
                <span className="nx-card-kicker">
                  ACTIVITY
                </span>

                <h2>
                  Recent Tasks
                </h2>

                <p>
                  Latest items from your workspace.
                </p>
              </div>
            </div>


            {tasks.length === 0 ? (

              <div className="nx-task-empty">
                <div className="nx-task-empty-icon">
                  ✓
                </div>

                <strong>
                  You're all clear
                </strong>

                <span>
                  No tasks have been added yet.
                </span>
              </div>

            ) : (

              <div className="nx-task-list">

                {tasks
                  .slice()
                  .reverse()
                  .slice(0, 5)
                  .map((task) => (

                    <div
                      className="nx-task-row"
                      key={task.id}
                    >

                      <div className="nx-task-check">
                        {task.status === "done"
                          ? "✓"
                          : "○"}
                      </div>

                      <div className="nx-task-main">

                        <strong>
                          {task.title}
                        </strong>

                        <span>
                          Task #{task.id}
                        </span>

                      </div>

                      <span
                        className={`nx-task-status ${getStatusClass(
                          task.status
                        )}`}
                      >
                        {getStatusLabel(task.status)}
                      </span>

                    </div>

                  ))}

              </div>

            )}

          </div>


          {/* ACCOUNT */}

          <div className="nx-card nx-account-card">

            <div className="nx-account-cover">
              <div className="nx-account-pattern"></div>
            </div>

            <div className="nx-account-body">

              <div className="nx-account-avatar">
                {user?.name
                  ? user.name.charAt(0).toUpperCase()
                  : "U"}
              </div>

              <span className="nx-card-kicker">
                ACCOUNT
              </span>

              <h2>
                {user?.name || "User"}
              </h2>

              <p>
                {user?.email || "No email"}
              </p>


              <div className="nx-account-details">

                <div>
                  <span>User ID</span>
                  <strong>
                    #{user?.id || "—"}
                  </strong>
                </div>

                <div>
                  <span>Projects</span>
                  <strong>
                    {projects.length}
                  </strong>
                </div>

                <div>
                  <span>Tasks</span>
                  <strong>
                    {tasks.length}
                  </strong>
                </div>

              </div>

            </div>

          </div>

        </section>


        {/* FOOTER */}

        <footer className="nx-footer">
          <span>
            TASKORA
          </span>

          <span>
            AI Project & Task Management Platform
          </span>

          <span>
            React • FastAPI • PostgreSQL • Gemini
          </span>
        </footer>

      </main>

    </div>
  );
}

export default Dashboard;
