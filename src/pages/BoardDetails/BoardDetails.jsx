import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './BoardDetails.css'
import { icons } from '../../cmps/SvgIcons.jsx'
import { BoardList } from '../../cmps/BoardDetails/BoardList.jsx'
import { boardService } from '../../services/board/board.service.js'
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
      cards: []
    }
    setBoard(prev => ({ ...prev, lists: [...prev.lists, newList] }))
  }

function onAddCard(listId) {
  const newTask = {
    id: 't' + Date.now(),
    title: 'Enter a title or paste a link'   
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


  return (
    <section className="board-details">
      <div className="board-header">
        <div className="board-title">
          <h1>{board.title}</h1>
          <span className="board-icon">▦</span>
          <span className="arrowdown">{icons.arrowDown}</span>
        </div>

        <div className="board-actions">
          <div className="members">
            {/* {board.members.map(m => (
              <div key={m.id} className="member-avatar">{m}</div>
            ))} */}
          </div>
          <button className="share-btn">+ Share</button>
          <button className="more-btn">⋯</button>
        </div>
      </div>

      <div className="lists-container">
        {board.lists.map(list => (
          <BoardList
           key={list.id}
            list={list}
            onAddCard={onAddCard} />
            
        ))}
         <button className="add-list-btn" onClick={onAddList}>
    {icons.addCard} Add another list
  </button>
      </div>
    </section>
  )
}
