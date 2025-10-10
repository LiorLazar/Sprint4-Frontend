import { icons } from "../SvgIcons.jsx"

export function TaskPreview({ task, onTaskClick }) {
  const bgColor = task.style?.backgroundColor || '#fff'

  return (
    <div className="task-preview" onClick={() => onTaskClick(task)}>
      <span className="task-title">{task.title}</span>
      <button className="edit-task-btn">
        {icons.editCard}
      </button>
    </div>
  )
}
