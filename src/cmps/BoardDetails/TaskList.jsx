import { useEffect, useRef, useState } from "react"
import { icons } from "../SvgIcons.jsx"
import { TaskPreview } from "./TaskPreview.jsx"

export function TaskList({ list, onAddCard, onCancelEmptyList, onRenameList }) {
  const [isAdding, setIsAdding] = useState(false)
  const [newTitle, setNewTitle] = useState("")
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [titleEdit, setTitleEdit] = useState(list.title || "")
  const listRef = useRef(null)

  useEffect(() => {
    function onDocMouseDown(ev) {
      if (!listRef.current) return
      if (listRef.current.contains(ev.target)) return
      if (isAdding) {
        setIsAdding(false)
        setNewTitle("")
      }
      if (isEditingTitle) {
        const trimmed = titleEdit.trim()
        if (!trimmed && (list.tasks || []).length === 0) {
          onCancelEmptyList?.(list.id)
        }
        setIsEditingTitle(false)
        setTitleEdit(list.title || "")
      }
    }
    document.addEventListener("mousedown", onDocMouseDown, true)
    return () => document.removeEventListener("mousedown", onDocMouseDown, true)
  }, [isAdding, isEditingTitle, list.id, (list.tasks || []).length, titleEdit, onCancelEmptyList, list.title])

  function handleAddCard() {
    const t = newTitle.trim()
    if (!t) return
    onAddCard(list.id, t)
    setNewTitle("")
    setIsAdding(false)
  }

  function handleCancelCard() {
    setNewTitle("")
    setIsAdding(false)
  }

  function handleSaveTitle() {
    const trimmed = titleEdit.trim()
    if (!trimmed) {
      onCancelEmptyList?.(list.id)
      return
    }
    onRenameList?.(list.id, trimmed)
    setIsEditingTitle(false)
  }

  function handleCancelTitle() {
    setIsEditingTitle(false)
    setTitleEdit(list.title || "")
  }

  // צבע רקע של הרשימה מוגדר לפי ה־style שבדאטה
  const listBg = list.style?.backgroundColor || "#f1f2f4"

  return (
    <div
      className="tasks-list"
      ref={listRef}
      style={{ backgroundColor: listBg }}
    >
      {isEditingTitle ? (
        <div className="list-title-editor">
          <input
            type="text"
            className="list-title-input"
            placeholder="Enter list name..."
            value={titleEdit}
            onChange={(e) => setTitleEdit(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSaveTitle()}
            autoFocus
          />
        </div>
      ) : (
        <h3 onClick={() => setIsEditingTitle(true)} title="Click to edit">
          {list.title}
          <button className="list-actions-btn" title="List actions">
            {icons.listActions}
          </button>
        </h3>
      )}

      <div className="task-list">
        {(list.tasks || []).map((task, idx) => (
          <TaskPreview key={task.id || `t_${idx}`} task={task} />
        ))}

        {isAdding && (
          <div className="add-card-form">
            <input
              type="text"
              className="task-preview-add-input"
              placeholder="Enter a title or paste a link"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddCard()}
              autoFocus
            />
            <div className="add-card-actions">
              <button className="add-card-btn" onClick={handleAddCard}>Add card</button>
              <button className="cancel-btn" onClick={handleCancelCard}>{icons.xButton}</button>
            </div>
          </div>
        )}
      </div>

      {!isAdding && !isEditingTitle && (
        <button className="add-task-btn" onClick={() => setIsAdding(true)}>
          {icons.addCard} Add a card
        </button>
      )}
    </div>
  )
}
