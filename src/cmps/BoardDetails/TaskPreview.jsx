import { icons } from "../SvgIcons.jsx"

export function TaskPreview({ task }) {
  const bgColor = task.style?.backgroundColor || '#fff'

  return (
    <div className="task-preview" style={{ backgroundColor: bgColor }}>
      <span className="task-title">{task.title}</span>
      <button className="edit-task-btn">
        {icons.editCard}
      </button>
    </div>
  )
}
