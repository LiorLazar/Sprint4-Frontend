import { icons } from "../SvgIcons.jsx"

export function TaskPreview({ task }) {
  return (
    <div className="task-preview">
      <span className="task-title">{task.title}</span>
      <button className="edit-task-btn">
        {icons.editCard}
      </button>
    </div>
  )
}
