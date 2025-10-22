import { useEffect, useRef, useState } from "react"
import { icons } from "../SvgIcons.jsx"
import { TaskPreview } from "./TaskPreview.jsx"

export function TaskList({ list, onAddCard, onCancelEmptyList, onRenameList, onTaskClick }) {
  const [isAdding, setIsAdding] = useState(false)
  const [newTitle, setNewTitle] = useState("")
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [titleEdit, setTitleEdit] = useState(list.title || "")
  const listRef = useRef(null)
  const inputRef = useRef(null)
  const addFormRef = useRef(null)

  useEffect(() => {
    function onDocMouseDown(ev) {
      if (!listRef.current) return
      const clickedInsideList = listRef.current.contains(ev.target)
      const clickedInsideInput = inputRef.current?.contains(ev.target)

      if (isAdding && !clickedInsideList) {
        setIsAdding(false)
        setNewTitle("")
      }

      if (isEditingTitle && !clickedInsideInput) {
        handleSaveTitle()
      }
    }

    document.addEventListener("mousedown", onDocMouseDown, true)
    return () => document.removeEventListener("mousedown", onDocMouseDown, true)
  }, [isAdding, isEditingTitle, titleEdit])

  // ===== ADD CARD =====
  function handleAddCard() {
    const t = newTitle.trim()
    if (!t) return
    onAddCard(list.id, t)
    setNewTitle("")
    setTimeout(() => addFormRef.current?.scrollIntoView({ behavior: "smooth" }), 50)
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

  useEffect(() => {
    if (isEditingTitle && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditingTitle])

  const listBg = list.style?.backgroundColor || "#f1f2f4"

  return (
    <div className="tasks-list" ref={listRef} style={{ backgroundColor: listBg }}>
      <div className="list-header">
        <input
          ref={inputRef}
          type="text"
          className={`list-title-input ${isEditingTitle ? "editing" : "readonly"}`}
          value={titleEdit}
          readOnly={!isEditingTitle}
          onClick={() => setIsEditingTitle(true)}
          onChange={(e) => setTitleEdit(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSaveTitle()}
        />
        <button
          className={`list-actions-btn ${isEditingTitle ? "is-disabled" : ""}`}
          title="List actions"
          aria-disabled={isEditingTitle}
        >
          {icons.listActions}
        </button>
      </div>

      <div className="task-list">
        {(list.tasks || []).map((task, idx) => (
          <TaskPreview
            key={task.id || `t_${idx}`}
            task={task}
            onTaskClick={onTaskClick}
          />
        ))}

        {isAdding && (
          <div className="add-card-form" ref={addFormRef}>
            <input
              type="text"
              className="task-preview-add-input"
              placeholder="Enter a title for this card..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddCard()}
              autoFocus
            />
            <div className="add-card-actions">
              <button className="add-card-btn" onClick={handleAddCard}>
                Add card
              </button>
              <button className="cancel-btn" onClick={handleCancelCard}>
                {icons.xButton}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="add-task-container">
        {!isAdding && (
          <button className="add-task-btn" onClick={() => setIsAdding(true)}>
            {icons.addCard} Add a card
          </button>
        )}
      </div>
    </div>
  )
}
