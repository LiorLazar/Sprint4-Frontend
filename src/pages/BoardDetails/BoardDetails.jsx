import { useEffect, useState } from 'react'
import { icons } from '../../cmps/SvgIcons.jsx'
import { BoardList } from '../../cmps/BoardDetails/BoardList.jsx'
import { boardService } from '../../services/board/board.service.js'
import './BoardDetails.css'
import { BoardHeader } from '../../cmps/BoardDetails/BoardHeader.jsx'

export function BoardDetails() {
  const [board, setBoard] = useState(null)

  useEffect(() => {
    async function loadBoard() {
      try {
        const board = await boardService.getById('b101')
        setBoard(board)
      } catch (err) {
        console.error("Failed to load board", err)
      }
    }

    loadBoard()
  }, [])

  if (!board) return <div>Loading...</div>

  function onAddList() {
    const newList = {
      id: 'l' + Date.now(),
      title: 'New List',
      tasks: []
    }

    setBoard(prev => ({
      ...prev,
      lists: [...prev.lists, newList]
    }))
  }

  function onAddCard(listId, title) {
    const newTask = {
      id: 't' + Date.now(),
      title
    }

    setBoard(prev => ({
      ...prev,
      lists: prev.lists.map(list =>
        list.id === listId
          ? { ...list, tasks: [...list.tasks, newTask] }
          : list
      )
    }))
  }

  return (
    <section className="board-details">
      <BoardHeader />
      <div className="lists-container">
        {board.lists.map(list => (
          <BoardList
            key={list.id}
            list={list}
            onAddCard={onAddCard}
            onListAction={(id) => console.log("List actions for:", id)}
          />
        ))}

        <button className="add-list-btn" onClick={onAddList}>
          {icons.addCard} Add another list
        </button>
      </div>
    </section>
  )
}
