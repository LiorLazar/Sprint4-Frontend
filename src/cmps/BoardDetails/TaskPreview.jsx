import { icons } from "../SvgIcons.jsx"
import { boardMembers, labelPalette } from '../../services/data.js'

export function TaskPreview({ task, onTaskClick }) {
  const backgroundColor = task.style?.backgroundColor || "#fff"

  function getMemberDetails(memberId) {
    return boardMembers.find(member => member.id === memberId)
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

  const allMembers = task?.members?.map(getMemberDetails).filter(Boolean) || []
  const isManyMembers = allMembers.length > 2

  const visibleMembers = allMembers.slice(0, 3)
  const hiddenCount = allMembers.length - visibleMembers.length

  return (
    <div
      className="task-preview"
      onClick={() => onTaskClick(task)}
      style={{ backgroundColor }}
    >
      {task.attachment?.url && (
        <div className="task-cover-preview">
          <img
            src={task.attachment.url}
            alt="Task cover"
            className="task-cover-image"
          />
        </div>
      )}

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

        {(dueLabel || hasChecklist || allMembers.length > 0) && (
          <div
            className={`task-meta-below ${isManyMembers ? "multi-line" : ""}`}
            style={{ width: "100%" }}
          >
            <div
              className="meta-top-row"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                flexWrap: "wrap",
              }}
            >
              {dueLabel && (
                <div
                  className={`task-due-container ${dueClass}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    borderRadius: "4px",
                    padding: "2px 6px",
                  }}
                >
                  <span className="task-due-icon">{icons.clock}</span>
                  <span>{dueLabel}</span>

                  {hasChecklist && (
                    <div
                      className="task-checklist-inline"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        marginLeft: "4px",
                      }}
                    >
                      <span className="icon">{icons.checklistItem}</span>
                      <span>{`${checklist.done}/${checklist.total}`}</span>
                    </div>
                  )}
                </div>
              )}

              {!dueLabel && hasChecklist && (
                <div
                  className="task-checklist-status"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    borderRadius: "4px",
                    padding: "2px 6px",
                  }}
                >
                  <span className="icon">{icons.checklistItem}</span>
                  <span>{`${checklist.done}/${checklist.total}`}</span>
                </div>
              )}

              {!isManyMembers && (
                <div
                  className="task-members-inline"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginLeft: "auto",
                    gap: "4px",
                  }}
                >
                  {visibleMembers.map(member => (
                    <span
                      key={member.id}
                      className="member-avatar"
                      style={{ backgroundColor: member.color }}
                      title={member.name}
                    >
                      {member.initials}
                    </span>
                  ))}
                  {hiddenCount > 0 && (
                    <span className="member-avatar more">{`+${hiddenCount}`}</span>
                  )}
                </div>
              )}
            </div>

            {isManyMembers && (
              <div className="task-members-below">
                {visibleMembers.map(member => (
                  <span
                    key={member.id}
                    className="member-avatar"
                    style={{ backgroundColor: member.color }}
                    title={member.name}
                  >
                    {member.initials}
                  </span>
                ))}
                {hiddenCount > 0 && (
                  <span className="member-avatar more">{`+${hiddenCount}`}</span>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
