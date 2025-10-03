import { useState } from "react"
import { icons } from "../SvgIcons.jsx"
import { TaskPreview } from "./TaskPreview.jsx"

export function BoardList({ list, onAddCard, onListAction }) {
  const [isAdding, setIsAdding] = useState(false)
  const [newTitle, setNewTitle] = useState("")

function handleAdd() {
  if (!newTitle.trim()) return
  onAddCard(list.id, newTitle.trim())
  setNewTitle("") 
}


  function handleCancel() {
    setNewTitle("")
    setIsAdding(false)
  }


return (
  <div className="board-list">
    <h3>
      {list.title}
      <button
        className="list-actions-btn"
        onClick={() => onListAction(list.id)}
      >
        {icons.listActions}
      </button>
    </h3>

    <div className="task-list">
      {list.tasks.map((task) => (
        <TaskPreview key={task.id} task={task} />
      ))}

      {isAdding && (
        <div className="add-card-form">
          <input
            type="text"
            className="task-preview" 
            placeholder="Enter a title or paste a link"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}  
            autoFocus
          />
          <div className="add-card-actions">
            <button className="add-card-btn" onClick={handleAdd}>
              Add card
            </button>
            <button className="cancel-btn" onClick={handleCancel}>
              {icons.xButton}
            </button>
          </div>
        </div>
      )}
    </div>

    {!isAdding && (
      <button onClick={() => setIsAdding(true)}>
        {icons.addCard} Add a card
      </button>
    )}
  </div>
)


}