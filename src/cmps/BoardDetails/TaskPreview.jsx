import { useState, useRef, useEffect } from 'react'
import { icons } from "../SvgIcons.jsx"
import { TaskActionsMenu } from "./TaskActionsMenu.jsx"
import { TaskDynamicModal } from "../TaskDetails/TaskDynamicModal.jsx"
import { boardMembers, labelPalette } from '../../services/data.js'

export function TaskPreview({ task, board, onTaskClick, onSave }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [menuAnchor, setMenuAnchor] = useState(null)
  const [activeModal, setActiveModal] = useState(null)
  const [shouldWrap, setShouldWrap] = useState(false)
  const btnRef = useRef(null)
  const membersRef = useRef(null)

  const bgColor = task.style?.backgroundColor || null
  const bgMode = task.style?.bgMode || (bgColor ? 'full' : 'default')

  // ===== HELPERS =====
  function getMemberDetails(memberId) {
    return boardMembers.find(member => member.id === memberId)
  }

  function getLabelColor(labelId) {
    const boardLabel = board?.labels?.find(l => l.id === labelId)
    if (boardLabel) return boardLabel.color
    const labelData = labelPalette[labelId]
    return typeof labelData === 'string' ? labelData : labelData?.color || '#gray'
  }

  // ===== COVER =====
  const coverImage =
    task.attachments?.find(att => att.isCover)?.url ||
    task.attachment?.url

  const hasImageCover = Boolean(coverImage)
  const hasColorCover = !hasImageCover && bgMode === 'cover' && !!task.style?.backgroundColor
  const hasAnyCover = hasImageCover || hasColorCover

  // ===== DATE HELPERS =====
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

  // ===== CHECKLIST =====
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

  // ===== MEMBERS =====
  const allMembers = task?.members?.map(getMemberDetails).filter(Boolean) || []
  const visibleMembers = allMembers.slice(0, 5)
  const hiddenCount = allMembers.length - visibleMembers.length

  useEffect(() => {
    if (!membersRef.current) return
    const container = membersRef.current
    const avatars = Array.from(container.children)
    if (avatars.length <= 1) return setShouldWrap(false)

    const firstTop = avatars[0].offsetTop
    const wrapped = avatars.some(el => el.offsetTop > firstTop)
    setShouldWrap(wrapped)
  }, [task.members])

  const dueLabel = formatDueDate(task?.dueDate)
  const dueClass = getDueClass(task?.dueDate)

  // ===== MENU =====
  function openMenu(ev) {
    ev.stopPropagation()
    const rect = ev.currentTarget.getBoundingClientRect()
    setMenuAnchor({
      top: rect.top,
      bottom: rect.bottom,
      left: rect.left,
      right: rect.right
    })
    setIsMenuOpen(true)
  }

  // ✅ מחיקת טסק אחת (Archive)
  async function handleDeleteTask() {
    if (!board) return
    const updatedBoard = {
      ...board,
      lists: board.lists.map(list => ({
        ...list,
        tasks: list.tasks.filter(t => t.id !== task.id)
      }))
    }
    await onSave(task, updatedBoard)
  }

  // ===== ACTION HANDLER =====
  function handleAction(type, ev) {
    ev.stopPropagation()
    setIsMenuOpen(false)
    const rect = ev.currentTarget.getBoundingClientRect()

    if (type === 'open') {
      onTaskClick(task)
    } else if (['labels', 'members', 'dates', 'attachments', 'cover', 'checklist'].includes(type)) {
      setActiveModal({
        type,
        anchor: { top: rect.top, bottom: rect.bottom, left: rect.left, right: rect.right }
      })
    } else if (type === 'archive') {
      handleDeleteTask()
    }
  }

  const isFullMode = bgMode === 'full' && !!bgColor

  return (
    <div
      className={`task-preview ${hasAnyCover ? 'has-cover' : 'no-cover'} ${isFullMode ? 'full-bg-mode' : ''}`}
      onClick={() => onTaskClick(task)}
    >
      <button ref={btnRef} className="edit-task-btn" onClick={openMenu} title="Task actions">
        {icons.editCard}
      </button>

      {hasImageCover ? (
        <div className="task-cover">
          <img src={coverImage} alt="Task cover" className="task-cover-img" />
        </div>
      ) : bgMode === 'cover' ? (
        <div className="task-cover task-cover-color" style={{ backgroundColor: bgColor }} />
      ) : null}

      <div
        className={`task-body ${hasImageCover || bgMode === 'cover' ? 'with-cover' : ''}`}
        style={isFullMode ? { backgroundColor: bgColor } : undefined}
      >
        {isFullMode ? (
          <div className="task-title-row full-mode">
            <span className="task-title strong">{task.title}</span>
          </div>
        ) : (
          <>
            {task.labels?.length > 0 && (
              <div className="preview-labels-bar">
                {task.labels.map(labelId => {
                  const color = getLabelColor(labelId)
                  return <span key={labelId} className="preview-label-bar" style={{ backgroundColor: color }} />
                })}
              </div>
            )}

            <div className="task-title-row">
              <span className="task-title">{task.title}</span>
            </div>

            {(dueLabel || hasChecklist || allMembers.length > 0) && (
              <div className={`task-meta-below ${shouldWrap ? 'multi-line' : ''}`}>
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
                            ? 'completed'
                            : 'in-progress'
                        }`}
                      >
                        <span className="icon">{icons.checklistItem}</span>
                        <span>{`${checklistSummary.done}/${checklistSummary.total}`}</span>
                      </div>
                    )}
                  </div>

                  {allMembers.length > 0 && (
                    <div ref={membersRef} className={`task-members-inline ${shouldWrap ? 'multi-line' : ''}`}>
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
                      {hiddenCount > 0 && <span className="member-avatar more">{`+${hiddenCount}`}</span>}
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {isMenuOpen && (
        <TaskActionsMenu
          anchor={menuAnchor}
          onClose={() => setIsMenuOpen(false)}
          onAction={handleAction}
          onDeleteTask={handleDeleteTask}
        />
      )}

      {activeModal && (
        <TaskDynamicModal
          type={activeModal.type}
          task={task}
          board={board}
          anchor={activeModal.anchor}
          onClose={() => setActiveModal(null)}
          onSave={onSave}
        />
      )}
    </div>
  )
}
