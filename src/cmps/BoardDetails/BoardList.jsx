

import { icons } from "../SvgIcons.jsx"
import { TaskPreview } from "./TaskPreview.jsx"

export function BoardList({ list, onAddCard }) {
  return (
    <div className="board-list">
      <h3>{list.title}{icons.listActions}</h3>
      <div className="task-list">
        {list.tasks.map((task) => (
          <TaskPreview key={task.id} task={task} />
        ))}
      </div>
      <button onClick={() => onAddCard(list.id)}>
        {icons.addCard} Add a card
      </button>
    </div>
  )
}
