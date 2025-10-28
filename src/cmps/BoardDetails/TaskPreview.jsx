import { icons } from "../SvgIcons.jsx"
import { boardMembers, labelPalette } from '../../services/data.js'

export function TaskPreview({ task, board, onTaskClick }) {
  const backgroundColor = task.style?.backgroundColor || "#fff"

  function getMemberDetails(memberId) {
    return boardMembers.find(member => member.id === memberId)
  }

  function getLabelColor(labelId) {
    const boardLabel = board?.labels?.find(l => l.id === labelId)
    if (boardLabel) return boardLabel.color
    const labelData = labelPalette[labelId]
    return typeof labelData === 'string' ? labelData : labelData?.color || '#gray'
  }

  // ======== COVER IMAGE ========
  const coverImage =
    task.attachments?.find(att => att.isCover)?.url ||
    task.attachments?.[0]?.url ||
    task.attachment?.url

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

  function getChecklistSummary(task) {
    if (!task.checklists || !task.checklists.length) return null
    let done = 0
    let total = 0
    for (const list of task.checklists) {
      for (const item of list.items) {
        total++
        if (item.done) done++
      }
    }
    if (total === 0) return null
    return { done, total }
  }

  const checklistSummary = getChecklistSummary(task)
  const hasChecklist = checklistSummary !== null

  const allMembers = task?.members?.map(getMemberDetails).filter(Boolean) || []
  const isManyMembers = allMembers.length > 2
  const visibleMembers = allMembers.slice(0, 3)
  const hiddenCount = allMembers.length - visibleMembers.length

  const dueLabel = formatDueDate(task?.dueDate)
  const dueClass = getDueClass(task?.dueDate)

  function onCircleClick(ev) {
    ev.stopPropagation()
    console.log('Circle clicked (mark complete coming soon)')
  }

  return (
    <div
      className="task-preview"
      onClick={() => onTaskClick(task)}
      style={{ backgroundColor }}
    >
      {/* ===== COVER IMAGE ===== */}
      {coverImage && (
        <div className="task-cover-preview">
          <img src={coverImage} alt="Task cover" className="task-cover-image" />
        </div>
      )}

      {/* ===== LABELS BAR ===== */}
      {task.labels?.length > 0 && (
        <div className="preview-labels-bar">
          {task.labels.map(labelId => {
            const color = getLabelColor(labelId)
            return (
              <span key={labelId} className="preview-label-bar" style={{ backgroundColor: color }} />
            )
          })}
        </div>
      )}

      {/* ===== CONTENT ===== */}
      <div className="task-content">
        <div className="task-title-row">
          <button
            className="task-complete-btn"
            onClick={onCircleClick}
            title="Mark complete"
          >
            <span className="circle-icon" />
          </button>
          <span className="task-title">{task.title}</span>
        </div>

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

        {(dueLabel || hasChecklist || task.description || allMembers.length > 0) && (
          <div className={`task-meta-below ${isManyMembers ? "multi-line" : ""}`}>
            <div className="meta-top-row">
              <div className="meta-left">
                {dueLabel && (
                  <div className={`task-due-container ${dueClass}`}>
                    <span className="task-due-icon">{icons.clock}</span>
                    <span>{dueLabel}</span>
                  </div>
                )}

                {hasChecklist && (
                  <div
                    className={`task-checklist-inline ${
                      checklistSummary.done === checklistSummary.total
                        ? "completed"
                        : "in-progress"
                    }`}
                  >
                    <span className="icon">{icons.checklistItem}</span>
                    <span>{`${checklistSummary.done}/${checklistSummary.total}`}</span>
                  </div>
                )}

                {task.description && task.description.trim() && (
                  <div className="task-desc-icon" title="Has description">
                    {icons.cardDescriptions}
                  </div>
                )}
              </div>

              {!isManyMembers && allMembers.length > 0 && (
                <div className="task-members-inline">
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
