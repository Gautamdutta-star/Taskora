import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getCurrentUser,
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  generateAITasks,
} from "../services/api";

function Projects() {
  const navigate = useNavigate();

  // =====================================================
  // STATE
  // =====================================================

  const [user, setUser] = useState(null);

  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);

  const [loading, setLoading] = useState(true);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // =====================================================
  // PROJECT FORM
  // =====================================================

  const [projectForm, setProjectForm] = useState({
    name: "",
    description: "",
  });

  const [editingProjectId, setEditingProjectId] = useState(null);

  // =====================================================
  // TASK FORM
  // =====================================================

  const [taskForm, setTaskForm] = useState({
    title: "",
    project_id: "",
    status: "todo",
    priority: "medium",
    due_date: "",
  });

  const [editingTaskId, setEditingTaskId] = useState(null);

  // =====================================================
  // SEARCH / FILTER
  // =====================================================

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  // =====================================================
  // AI TASK GENERATOR
  // =====================================================

  const [aiGoal, setAiGoal] = useState(
    "Build a modern e-commerce website"
  );

  const [aiProjectId, setAiProjectId] = useState("");
  const [aiTasks, setAiTasks] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [addingAITask, setAddingAITask] = useState(null);

  // =====================================================
  // LOAD DATA
  // =====================================================

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const currentUser = await getCurrentUser();
      const projectData = await getProjects();
      const taskData = await getTasks();

      setUser(currentUser);
      setProjects(projectData);
      setTasks(taskData);

      // Automatically select first valid project for AI
      if (projectData.length > 0) {
        setAiProjectId((currentId) => {
          const exists = projectData.some(
            (project) =>
              String(project.id) === String(currentId)
          );

          if (exists) {
            return currentId;
          }

          return String(projectData[0].id);
        });
      } else {
        setAiProjectId("");
      }

      return {
        currentUser,
        projectData,
        taskData,
      };
    } catch (err) {
      console.error("Load data error:", err);

      if (err.response?.status === 401) {
        localStorage.removeItem("access_token");
        navigate("/login");
        return null;
      }

      setError(
        err.response?.data?.detail ||
          "Failed to load projects and tasks."
      );

      return null;
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

    loadData();
  }, []);

  // =====================================================
  // CLEAR MESSAGES
  // =====================================================

  const clearMessages = () => {
    setMessage("");
    setError("");
  };

  // =====================================================
  // PROJECT FORM
  // =====================================================

  const handleProjectChange = (e) => {
    const { name, value } = e.target;

    setProjectForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    clearMessages();
  };

  // =====================================================
  // CREATE / UPDATE PROJECT
  // =====================================================

  const handleProjectSubmit = async () => {
    clearMessages();

    if (!user) {
      setError("User information is not available.");
      return;
    }

    if (!projectForm.name.trim()) {
      setError("Project name is required.");
      return;
    }

    try {
      const data = {
        name: projectForm.name.trim(),
        description: projectForm.description.trim(),
        user_id: user.id,
      };

      let savedProject = null;

      if (editingProjectId) {
        savedProject = await updateProject(
          editingProjectId,
          data
        );

        setMessage("Project updated successfully.");
      } else {
        savedProject = await createProject(data);

        setMessage("Project created successfully.");
      }

      setProjectForm({
        name: "",
        description: "",
      });

      setEditingProjectId(null);

      const loaded = await loadData();

      if (savedProject?.id) {
        setAiProjectId(String(savedProject.id));
      } else if (loaded?.projectData?.length > 0) {
        setAiProjectId(
          String(loaded.projectData[0].id)
        );
      }
    } catch (err) {
      console.error("Project save error:", err);

      setError(
        err.response?.data?.detail ||
          err.message ||
          "Failed to save project."
      );
    }
  };

  // =====================================================
  // EDIT PROJECT
  // =====================================================

  const handleEditProject = (project) => {
    clearMessages();

    setEditingProjectId(project.id);

    setProjectForm({
      name: project.name || "",
      description: project.description || "",
    });

    setTimeout(() => {
      document
        .getElementById("project-form")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
    }, 100);
  };

  // =====================================================
  // CANCEL PROJECT EDIT
  // =====================================================

  const handleCancelProjectEdit = () => {
    setEditingProjectId(null);

    setProjectForm({
      name: "",
      description: "",
    });

    clearMessages();
  };

  // =====================================================
  // DELETE PROJECT
  // =====================================================

  const handleDeleteProject = async (projectId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project? Its tasks will also be deleted."
    );

    if (!confirmed) {
      return;
    }

    try {
      clearMessages();

      await deleteProject(projectId);

      setMessage("Project deleted successfully.");

      if (
        String(aiProjectId) ===
        String(projectId)
      ) {
        setAiProjectId("");
        setAiTasks([]);
      }

      await loadData();
    } catch (err) {
      console.error("Project delete error:", err);

      setError(
        err.response?.data?.detail ||
          err.message ||
          "Failed to delete project."
      );
    }
  };

  // =====================================================
  // TASK FORM
  // =====================================================

  const handleTaskChange = (e) => {
    const { name, value } = e.target;

    setTaskForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    clearMessages();
  };

  // =====================================================
  // CREATE / UPDATE TASK
  // =====================================================

  const handleTaskSubmit = async () => {
    clearMessages();

    if (!taskForm.title.trim()) {
      setError("Task title is required.");
      return;
    }

    if (!taskForm.project_id) {
      setError("Please select a project.");
      return;
    }

    try {
      const data = {
        title: taskForm.title.trim(),
        project_id: Number(taskForm.project_id),
        status: taskForm.status,
        priority: taskForm.priority,
        due_date: taskForm.due_date || null,
      };

      if (editingTaskId) {
        await updateTask(
          editingTaskId,
          data
        );

        setMessage("Task updated successfully.");
      } else {
        await createTask(data);

        setMessage("Task created successfully.");
      }

      setTaskForm({
        title: "",
        project_id: "",
        status: "todo",
        priority: "medium",
        due_date: "",
      });

      setEditingTaskId(null);

      await loadData();
    } catch (err) {
      console.error("Task save error:", err);

      setError(
        err.response?.data?.detail ||
          err.message ||
          "Failed to save task."
      );
    }
  };

  // =====================================================
  // EDIT TASK
  // =====================================================

  const handleEditTask = (task) => {
    clearMessages();

    setEditingTaskId(task.id);

    setTaskForm({
      title: task.title || "",
      project_id: String(task.project_id),
      status: task.status || "todo",
      priority: task.priority || "medium",
      due_date: task.due_date || "",
    });

    setTimeout(() => {
      document
        .getElementById("task-form")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
    }, 100);
  };

  // =====================================================
  // CANCEL TASK EDIT
  // =====================================================

  const handleCancelTaskEdit = () => {
    setEditingTaskId(null);

    setTaskForm({
      title: "",
      project_id: "",
      status: "todo",
      priority: "medium",
      due_date: "",
    });

    clearMessages();
  };

  // =====================================================
  // DELETE TASK
  // =====================================================

  const handleDeleteTask = async (taskId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) {
      return;
    }

    try {
      clearMessages();

      await deleteTask(taskId);

      setMessage("Task deleted successfully.");

      await loadData();
    } catch (err) {
      console.error("Task delete error:", err);

      setError(
        err.response?.data?.detail ||
          err.message ||
          "Failed to delete task."
      );
    }
  };

  // =====================================================
  // AI TASK GENERATION
  // =====================================================

  const handleGenerateAITasks = async () => {
    clearMessages();
    setAiTasks([]);

    if (!aiGoal.trim()) {
      setError("Please enter a project goal.");
      return;
    }

    if (!aiProjectId) {
      setError("Please select a project for AI tasks.");
      return;
    }

    try {
      setAiLoading(true);

      const response = await generateAITasks(
        aiGoal.trim()
      );

      const taskText = response?.tasks || "";

      const generatedTasks = taskText
        .split("\n")
        .map((task) =>
          task
            .replace(/^\s*\d+[\.\)]\s*/, "")
            .replace(/^[-*]\s*/, "")
            .trim()
        )
        .filter(Boolean);

      setAiTasks(generatedTasks);

      if (generatedTasks.length === 0) {
        setError("AI did not generate any tasks.");
      } else {
        setMessage(
          `${generatedTasks.length} AI tasks generated successfully.`
        );
      }
    } catch (err) {
      console.error("AI generation error:", err);

      if (err.response?.status === 401) {
        localStorage.removeItem("access_token");
        navigate("/login");
        return;
      }

      setError(
        err.response?.data?.detail ||
          err.message ||
          "Failed to generate AI tasks."
      );
    } finally {
      setAiLoading(false);
    }
  };

  // =====================================================
  // ADD SINGLE AI TASK
  // =====================================================

  const handleAddAITask = async (task, index) => {
    if (!aiProjectId) {
      setError("Please select a project first.");
      return;
    }

    try {
      setAddingAITask(index);
      clearMessages();

      await createTask({
        title: task,
        project_id: Number(aiProjectId),
        status: "todo",
        priority: "medium",
        due_date: null,
      });

      setMessage(
        `AI task added successfully: ${task}`
      );

      await loadData();
    } catch (err) {
      console.error("Add AI task error:", err);

      setError(
        err.response?.data?.detail ||
          err.message ||
          "Failed to add AI task."
      );
    } finally {
      setAddingAITask(null);
    }
  };

  // =====================================================
  // ADD ALL AI TASKS
  // =====================================================

  const handleAddAllAITasks = async () => {
    if (!aiProjectId) {
      setError("Please select a project first.");
      return;
    }

    if (aiTasks.length === 0) {
      setError("No AI tasks available.");
      return;
    }

    try {
      setAddingAITask("all");
      clearMessages();

      for (const task of aiTasks) {
        await createTask({
          title: task,
          project_id: Number(aiProjectId),
          status: "todo",
          priority: "medium",
          due_date: null,
        });
      }

      const count = aiTasks.length;

      setAiTasks([]);

      setMessage(
        `${count} AI generated tasks added successfully.`
      );

      await loadData();
    } catch (err) {
      console.error(
        "Add all AI tasks error:",
        err
      );

      setError(
        err.response?.data?.detail ||
          err.message ||
          "Failed to add AI tasks."
      );
    } finally {
      setAddingAITask(null);
    }
  };

  // =====================================================
  // FILTER TASKS
  // =====================================================

  const filteredTasks = tasks.filter((task) => {
    const title = task.title || "";

    const matchesSearch = title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      task.status === statusFilter;

    const matchesPriority =
      priorityFilter === "all" ||
      task.priority === priorityFilter;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesPriority
    );
  });

  // =====================================================
  // HELPERS
  // =====================================================

  const getProjectName = (projectId) => {
    const project = projects.find(
      (item) =>
        Number(item.id) === Number(projectId)
    );

    return project
      ? project.name
      : "Unknown Project";
  };

  const getStatusLabel = (status) => {
    if (status === "in-progress") {
      return "In Progress";
    }

    if (status === "done") {
      return "Done";
    }

    return "Todo";
  };

  const getPriorityLabel = (priority) => {
    if (priority === "high") {
      return "High";
    }

    if (priority === "low") {
      return "Low";
    }

    return "Medium";
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="page-container">
        <h1>Loading Projects...</h1>
      </div>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="page-container">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="page-header">

        <h1>Projects & Tasks</h1>

        <p>
          Manage your projects and tasks.
        </p>

        <div className="navigation-buttons">

          <button
            type="button"
            onClick={() =>
              navigate("/dashboard")
            }
          >
            Dashboard
          </button>

        </div>

      </div>


      {/* =================================================
          MESSAGES
      ================================================= */}

      {message && (
        <div className="success-message">
          {message}
        </div>
      )}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}


      {/* =================================================
          AI TASK GENERATOR
      ================================================= */}

      <div className="section-card ai-generator-card">

        <div className="section-header">

          <span className="section-eyebrow">
            AI POWERED
          </span>

          <h2>
            🤖 AI Task Generator
          </h2>

          <p>
            Enter your project goal and let AI
            generate practical tasks automatically.
          </p>

        </div>


        <div className="ai-generator-form">

          <div className="form-group">

            <label>
              Project Goal
            </label>

            <textarea
              value={aiGoal}
              onChange={(e) =>
                setAiGoal(e.target.value)
              }
              placeholder="Example: Build a modern e-commerce website"
              rows="4"
            />

          </div>


          <div className="form-group">

            <label>
              Add AI Tasks To Project
            </label>

            <select
              value={aiProjectId}
              onChange={(e) => {
                setAiProjectId(
                  e.target.value
                );

                clearMessages();
              }}
            >

              <option value="">
                Select a project
              </option>

              {projects.map((project) => (
                <option
                  key={project.id}
                  value={project.id}
                >
                  {project.name}
                </option>
              ))}

            </select>

          </div>


          <button
            type="button"
            onClick={handleGenerateAITasks}
            disabled={
              aiLoading ||
              projects.length === 0
            }
          >
            {aiLoading
              ? "🤖 Generating..."
              : "✨ Generate AI Tasks"}
          </button>

        </div>


        {/* AI RESULTS */}

        {aiTasks.length > 0 && (

          <div className="ai-results">

            <div className="ai-results-header">

              <div>

                <h3>
                  ✨ AI Generated Tasks
                </h3>

                <p>
                  {aiTasks.length} task(s) generated
                </p>

              </div>


              <button
                type="button"
                className="small-button"
                onClick={handleAddAllAITasks}
                disabled={
                  addingAITask === "all"
                }
              >
                {addingAITask === "all"
                  ? "Adding..."
                  : "＋ Add All Tasks"}
              </button>

            </div>


            <div className="ai-task-list">

              {aiTasks.map((task, index) => (

                <div
                  className="ai-task-item"
                  key={`${task}-${index}`}
                >

                  <div className="ai-task-number">
                    {index + 1}
                  </div>

                  <div className="ai-task-content">

                    <p>
                      {task}
                    </p>

                  </div>

                  <button
                    type="button"
                    className="small-button"
                    onClick={() =>
                      handleAddAITask(
                        task,
                        index
                      )
                    }
                    disabled={
                      addingAITask !== null
                    }
                  >
                    {addingAITask === index
                      ? "Adding..."
                      : "＋ Add"}
                  </button>

                </div>

              ))}

            </div>

          </div>

        )}

      </div>


      {/* =================================================
          CREATE / EDIT PROJECT
      ================================================= */}

      <div
        className="form-card"
        id="project-form"
      >

        <h2>
          {editingProjectId
            ? "Edit Project"
            : "Create New Project"}
        </h2>


        <div className="form-group">

          <label>
            Project Name
          </label>

          <input
            type="text"
            name="name"
            placeholder="Enter project name"
            value={projectForm.name}
            onChange={handleProjectChange}
          />

        </div>


        <div className="form-group">

          <label>
            Description
          </label>

          <textarea
            name="description"
            placeholder="Enter project description"
            value={projectForm.description}
            onChange={handleProjectChange}
          />

        </div>


        <div className="action-buttons">

          <button
            type="button"
            onClick={handleProjectSubmit}
          >
            {editingProjectId
              ? "Update Project"
              : "Create Project"}
          </button>


          {editingProjectId && (

            <button
              type="button"
              onClick={
                handleCancelProjectEdit
              }
            >
              Cancel
            </button>

          )}

        </div>

      </div>


      {/* =================================================
          PROJECT LIST
      ================================================= */}

      <div className="section-card">

        <h2>
          Projects
        </h2>

        <p>
          {projects.length} project(s)
        </p>


        {projects.length === 0 ? (

          <p>
            No projects found.
          </p>

        ) : (

          <div>

            {projects.map((project) => {

              const projectTasks =
                tasks.filter(
                  (task) =>
                    Number(
                      task.project_id
                    ) ===
                    Number(project.id)
                );

              return (

                <div
                  className="project-card"
                  key={project.id}
                >

                  <h3>
                    {project.name}
                  </h3>

                  <p>
                    {project.description ||
                      "No description"}
                  </p>

                  <p>
                    <strong>
                      Project ID:
                    </strong>{" "}
                    {project.id}
                  </p>

                  <p>
                    <strong>
                      Tasks:
                    </strong>{" "}
                    {projectTasks.length}
                  </p>


                  <div className="action-buttons">

                    <button
                      type="button"
                      onClick={() =>
                        handleEditProject(
                          project
                        )
                      }
                    >
                      Edit
                    </button>


                    <button
                      type="button"
                      onClick={() =>
                        handleDeleteProject(
                          project.id
                        )
                      }
                    >
                      Delete
                    </button>

                  </div>

                </div>

              );
            })}

          </div>

        )}

      </div>


      {/* =================================================
          CREATE / EDIT TASK
      ================================================= */}

      <div
        className="form-card"
        id="task-form"
      >

        <h2>
          {editingTaskId
            ? "Edit Task"
            : "Create New Task"}
        </h2>


        <div className="form-group">

          <label>
            Task Title
          </label>

          <input
            type="text"
            name="title"
            placeholder="Enter task title"
            value={taskForm.title}
            onChange={handleTaskChange}
          />

        </div>


        <div className="form-group">

          <label>
            Project
          </label>

          <select
            name="project_id"
            value={taskForm.project_id}
            onChange={handleTaskChange}
          >

            <option value="">
              Select Project
            </option>

            {projects.map((project) => (

              <option
                key={project.id}
                value={project.id}
              >
                {project.name}
              </option>

            ))}

          </select>

        </div>


        <div className="form-group">

          <label>
            Status
          </label>

          <select
            name="status"
            value={taskForm.status}
            onChange={handleTaskChange}
          >

            <option value="todo">
              Todo
            </option>

            <option value="in-progress">
              In Progress
            </option>

            <option value="done">
              Done
            </option>

          </select>

        </div>


        <div className="form-group">

          <label>
            Priority
          </label>

          <select
            name="priority"
            value={taskForm.priority}
            onChange={handleTaskChange}
          >

            <option value="low">
              Low
            </option>

            <option value="medium">
              Medium
            </option>

            <option value="high">
              High
            </option>

          </select>

        </div>


        <div className="form-group">

          <label>
            Due Date
          </label>

          <input
            type="date"
            name="due_date"
            value={taskForm.due_date}
            onChange={handleTaskChange}
          />

        </div>


        <div className="action-buttons">

          <button
            type="button"
            onClick={handleTaskSubmit}
          >
            {editingTaskId
              ? "Update Task"
              : "Create Task"}
          </button>


          {editingTaskId && (

            <button
              type="button"
              onClick={
                handleCancelTaskEdit
              }
            >
              Cancel
            </button>

          )}

        </div>

      </div>


      {/* =================================================
          SEARCH & FILTER
      ================================================= */}

      <div className="section-card">

        <h2>
          Search & Filter Tasks
        </h2>


        <div className="filter-container">

          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />


          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(
                e.target.value
              )
            }
          >

            <option value="all">
              All Status
            </option>

            <option value="todo">
              Todo
            </option>

            <option value="in-progress">
              In Progress
            </option>

            <option value="done">
              Done
            </option>

          </select>


          <select
            value={priorityFilter}
            onChange={(e) =>
              setPriorityFilter(
                e.target.value
              )
            }
          >

            <option value="all">
              All Priorities
            </option>

            <option value="low">
              Low
            </option>

            <option value="medium">
              Medium
            </option>

            <option value="high">
              High
            </option>

          </select>

        </div>

      </div>


      {/* =================================================
          TASK LIST
      ================================================= */}

      <div className="section-card">

        <h2>
          Tasks
        </h2>

        <p>
          Showing {filteredTasks.length} of{" "}
          {tasks.length} task(s)
        </p>


        {filteredTasks.length === 0 ? (

          <p>
            No tasks match your
            search/filter.
          </p>

        ) : (

          <div>

            {filteredTasks.map((task) => (

              <div
                className="task-card"
                key={task.id}
              >

                <h3>
                  {task.title}
                </h3>


                <p>
                  <strong>
                    Project:
                  </strong>{" "}
                  {getProjectName(
                    task.project_id
                  )}
                </p>


                <p>
                  <strong>
                    Status:
                  </strong>{" "}
                  {getStatusLabel(
                    task.status
                  )}
                </p>


                <p>
                  <strong>
                    Priority:
                  </strong>{" "}
                  {getPriorityLabel(
                    task.priority
                  )}
                </p>


                <p>
                  <strong>
                    Due Date:
                  </strong>{" "}
                  {task.due_date ||
                    "Not set"}
                </p>


                <div className="action-buttons">

                  <button
                    type="button"
                    onClick={() =>
                      handleEditTask(task)
                    }
                  >
                    Edit
                  </button>


                  <button
                    type="button"
                    onClick={() =>
                      handleDeleteTask(
                        task.id
                      )
                    }
                  >
                    Delete
                  </button>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}

export default Projects;