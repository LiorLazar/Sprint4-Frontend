import { useState } from 'react'
import { Link } from 'react-router-dom'
import './BoardDetails.css'

export function BoardDetails() {
  const [board, setBoard] = useState({
    title: 'Work-Management',
    members: ['GA', 'LL', 'R'],
    lists: [
      {
        id: 'l101',
        title: 'Group Backlog',
        cards: [{ id: 'c101', title: 'Group List' }]
      },
      {
        id: 'l102',
        title: 'Client Backlog',
        cards: [
          { id: 'c102', title: 'App Header' },
          { id: 'c103', title: 'Bonus - Drag & Drop' },
          { id: 'c104', title: 'Create SVG List Component' }
        ]
      },
      {
        id: 'l103',
        title: 'Board Backlog',
        cards: [
          { id: 'c105', title: 'Board Index' },
          { id: 'c106', title: 'Board Details' },
          { id: 'c107', title: 'Board Header' },
          { id: 'c108', title: 'Board List' }
        ]
      },
      {
        id: 'l104',
        title: 'Task Backlog',
        cards: [
          { id: 'c109', title: 'Task List' },
          { id: 'c110', title: 'Task Details' },
          { id: 'c111', title: 'Task Preview' }
        ]
      },
      {
        id: 'l105',
        title: 'In Development',
        cards: []
      },
      {
        id: 'l106',
        title: 'Done',
        cards: []
      }
    ]
  })

  function onAddList() {
    const newList = {
      id: 'l' + Date.now(),
      title: 'New List',
      cards: []
    }
    setBoard(prev => ({ ...prev, lists: [...prev.lists, newList] }))
  }

  function onAddCard(listId) {
    const newCard = {
      id: 'c' + Date.now(),
      title: 'New Card'
    }
    setBoard(prev => ({
      ...prev,
      lists: prev.lists.map(list =>
        list.id === listId
          ? { ...list, cards: [...list.cards, newCard] }
          : list
      )
    }))
  }

  return (
    <section className="board-details">
      {/* Header פנימי */}
      <div className="board-header">
        <div className="board-title">
          <h1>{board.title}</h1>
          <span className="board-icon">▦</span>
          <span className="dropdown">⌄</span>
        </div>

        <div className="board-actions">
          <div className="members">
            {board.members.map(m => (
              <div key={m} className="member-avatar">{m}</div>
            ))}
          </div>
          <button className="share-btn">+ Share</button>
          <button className="more-btn">⋯</button>
        </div>
      </div>

      {/* תוכן הלוח */}
      <div className="lists-container">
        {board.lists.map(list => (
          <div key={list.id} className="list">
            <h3>{list.title}</h3>
            <ul>
              {list.cards.map(card => (
                <li key={card.id}>{card.title}</li>
              ))}
            </ul>
            <button onClick={() => onAddCard(list.id)}>+ Add a card</button>
          </div>
        ))}
        <button className="add-list-btn" onClick={onAddList}>+ Add another list</button>
      </div>
    </section>
  )
}
