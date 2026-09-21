import { useState } from "react";
import { generateAITasks } from "../services/api";

function AITaskGenerator({ projects = [], onTaskCreated }) {
  const [goal, setGoal] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const [generatedTasks, setGeneratedTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addingTask, setAddingTask] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleGenerate = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");
    setGeneratedTasks([]);

    if (!goal.trim()) {
      setError("Please enter a project goal.");
      return;
    }

    if (!selectedProject) {
      setError("Please select a project.");
      return;
    }

    try {
      setLoading(true);

      const data = await generateAITasks(goal.trim());

      const taskText = data.tasks || "";

      const tasks = taskText
        .split("\n")
        .map((task) =>
          task
            .replace(/^\s*\d+[\.\)]\s*/, "")
            .trim()
        )
        .filter(Boolean);

      setGeneratedTasks(tasks);

      if (tasks.length === 0) {
        setError("AI did not generate any tasks.");
      }
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.detail ||
        "Failed to generate AI tasks."
      );
    } finally {
      setLoading(false);
    }
  };


  const handleAddTask = async (task, index) => {
    try {
      setAddingTask(index);
      setMessage("");
      setError("");

      const response = await fetch(
        "http://127.0.0.1:8000/tasks",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem(
              "access_token"
            )}`,
          },
          body: JSON.stringify({
            title: task,
            project_id: Number(selectedProject),
            status: "todo",
            priority: "medium",
            due_date: null,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.detail || "Failed to add task."
        );
      }

      setMessage(`Task added: ${task}`);

      if (onTaskCreated) {
        onTaskCreated();
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setAddingTask(null);
    }
  };


  return (
    <section className="section-card ai-generator-card">

      <div className="section-header">
        <div>
          <span className="section-eyebrow">
            AI POWERED
          </span>

          <h2>🤖 AI Task Generator</h2>

          <p>
            Enter your project goal and let AI generate
            practical tasks for you.
          </p>
        </div>
      </div>


      <form
        onSubmit={handleGenerate}
        className="ai-generator-form"
      >

        <div className="form-group">

          <label>
            Project Goal
          </label>

          <textarea
            value={goal}
            onChange={(e) =>
              setGoal(e.target.value)
            }
            placeholder="Example: Build a modern e-commerce website"
            rows="4"
          />

        </div>


        <div className="form-group">

          <label>
            Add Tasks To Project
          </label>

          <select
            value={selectedProject}
            onChange={(e) =>
              setSelectedProject(e.target.value)
            }
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
          type="submit"
          className="primary-button"
          disabled={loading}
        >
          {loading
            ? "🤖 Generating..."
            : "✨ Generate AI Tasks"}
        </button>

      </form>


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


      {generatedTasks.length > 0 && (
        <div className="ai-results">

          <div className="ai-results-header">

            <h3>
              ✨ AI Generated Tasks
            </h3>

            <span>
              {generatedTasks.length} tasks
            </span>

          </div>


          <div className="ai-task-list">

            {generatedTasks.map((task, index) => (

              <div
                className="ai-task-item"
                key={`${task}-${index}`}
              >

                <div className="ai-task-number">
                  {index + 1}
                </div>


                <div className="ai-task-content">
                  <p>{task}</p>
                </div>


                <button
                  type="button"
                  className="small-button"
                  onClick={() =>
                    handleAddTask(task, index)
                  }
                  disabled={addingTask === index}
                >
                  {addingTask === index
                    ? "Adding..."
                    : "＋ Add"}
                </button>

              </div>

            ))}

          </div>

        </div>
      )}

    </section>
  );
}

export default AITaskGenerator;