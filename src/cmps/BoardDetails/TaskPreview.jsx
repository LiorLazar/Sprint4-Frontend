import { icons } from "../SvgIcons.jsx"

export function TaskPreview({ task, onTaskClick }) {
  const backgroundColor = task.style?.backgroundColor || "#fff"

  const labelPalette = {
    green: "#61bd4f",
    yellow: "#f2d600",
    orange: "#ff9f1a",
    red: "#eb5a46",
    purple: "#c377e0",
    blue: "#0079bf",
  }

  function parseDate(value) {
    if (!value && value !== 0) return null
    const dateObj = typeof value === "number" ? new Date(value) : new Date(String(value))
    return isNaN(dateObj) ? null : dateObj
  }

  function formatDueDate(value) {
    const dateObj = parseDate(value)
    if (!dateObj) return null
    return dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  function getDueClass(value) {
    const dateObj = parseDate(value)
    if (!dateObj) return ""
    const now = new Date()
    if (dateObj < now) return "overdue"
    const diffDays = (dateObj - now) / (1000 * 60 * 60 * 24)
    if (diffDays < 1) return "due-soon"
    return "upcoming"
  }

  const dueLabel = formatDueDate(task?.dueDate)
  const dueClass = getDueClass(task?.dueDate)
  const checklist = task?.checklist
  const hasChecklist =
    checklist &&
    typeof checklist.done === "number" &&
    typeof checklist.total === "number" &&
    checklist.total > 0

  return (
    <div
      className="task-preview"
      onClick={() => onTaskClick(task)}
      style={{ backgroundColor }}
    >
      {task.labels?.length > 0 && (
        <div className="preview-labels-bar">
          {task.labels.map(labelId => (
            <span
              key={labelId}
              className="preview-label-bar"
              style={{ backgroundColor: labelPalette[labelId] }}
            />
          ))}
        </div>
      )}

      <div className="task-content">
        <span className="task-title">{task.title}</span>

        <button
          className="edit-task-btn"
          onClick={(event) => {
            event.stopPropagation()
            onTaskClick(task)
          }}
          title="Open task"
        >
          {icons.editCard}
        </button>

        {(dueLabel || hasChecklist) && (
          <div className="task-meta-below" style={{ width: "100%" }}>
            {dueLabel && (
              <div className={`task-due-container ${dueClass}`}>
                <span className="task-due-icon">{icons.clock}</span>
                <span>{dueLabel}</span>
              </div>
            )}

            {hasChecklist && (
              <div
                className="task-checklist-status"
                style={{
                  marginTop: "4px",
                  fontSize: "12px",
                  color: "#6b778c",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <span style={{ display: "inline-flex", alignItems: "center" }}>
                  {icons.checklistItem}
                </span>
                <span>{`${checklist.done}/${checklist.total}`}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
