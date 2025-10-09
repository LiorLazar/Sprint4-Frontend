import { useEffect, useRef, useState } from 'react'
import { TaskList } from '../../cmps/BoardDetails/TaskList.jsx'
import { boardService } from '../../services/board/board.service.local.js'
import { utilService } from '../../services/util.service.js'
import { icons } from '../../cmps/SvgIcons.jsx'
import { BoardHeader } from '../../cmps/BoardDetails/BoardHeader.jsx'

export function BoardDetails() {
  const [board, setBoard] = useState(null)
  const [isAddingList, setIsAddingList] = useState(false)
  const [newListTitle, setNewListTitle] = useState('')
  const addListRef = useRef(null)
  const listsContainerRef = useRef(null)

  useEffect(() => {
    loadBoard()
  }, [])

  async function loadBoard() {
    const boards = await boardService.query()
    setBoard(boards[0])
  }

  useEffect(() => {
    function handleClickOutside(ev) {
      if (!isAddingList) return
      if (addListRef.current && !addListRef.current.contains(ev.target)) {
        setIsAddingList(false)
        setNewListTitle('')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isAddingList])

  async function onAddListConfirm() {
    const title = newListTitle.trim()
    if (!title) {
      setIsAddingList(false)
      setNewListTitle('')
      return
    }

    const newList = { id: utilService.makeId(), title, tasks: [] }
    const updatedBoard = { ...board, lists: [...board.lists, newList] }

    setBoard(updatedBoard)
    boardService.save(updatedBoard)
    setNewListTitle('')
    setIsAddingList(true)
    setTimeout(() => {
      listsContainerRef.current?.lastElementChild?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'end',
      })
      const input = addListRef.current?.querySelector('input')
      input?.focus()
    }, 100)
  }

  function onRenameList(listId, newTitle) {
    const trimmed = newTitle.trim()
    if (!trimmed) return onCancelEmptyList(listId)
    const updatedLists = board.lists.map(list =>
      list.id === listId ? { ...list, title: trimmed } : list
    )
    const updatedBoard = { ...board, lists: updatedLists }
    setBoard(updatedBoard)
    boardService.save(updatedBoard)
  }

  function onAddCard(listId, title) {
    const t = title.trim()
    if (!t) return
    const newTask = { id: utilService.makeId(), title: t, createdAt: Date.now() }
    const updatedLists = board.lists.map(list =>
      list.id === listId ? { ...list, tasks: [...list.tasks, newTask] } : list
    )
    const updatedBoard = { ...board, lists: updatedLists }
    setBoard(updatedBoard)
    boardService.save(updatedBoard)
  }

  function onCancelEmptyList(listId) {
    const list = board.lists.find(l => l.id === listId)
    if (!list || list.tasks.length > 0) return
    const updatedLists = board.lists.filter(l => l.id !== listId)
    const updatedBoard = { ...board, lists: updatedLists }
    setBoard(updatedBoard)
    boardService.save(updatedBoard)
  }

  if (!board) return <div>Loading board...</div>

  return (
    <section className="board-details">
      <BoardHeader />
      <div className="lists-container" ref={listsContainerRef}>
        {board.lists.map(list => (
          <TaskList
            key={list.id}
            list={list}
            onCancelEmptyList={onCancelEmptyList}
            onRenameList={onRenameList}
            onAddCard={onAddCard}
          />
        ))}

        {isAddingList ? (
          <div className="tasks-list add-list-form" ref={addListRef}>
            <input
              type="text"
              className="list-title-input"
              placeholder="Enter list name..."
              value={newListTitle}
              onChange={ev => setNewListTitle(ev.target.value)}
              onKeyDown={ev => ev.key === 'Enter' && onAddListConfirm()}
              autoFocus
            />
            <div className="add-card-actions">
              <button className="add-card-btn" onClick={onAddListConfirm}>
                Add list
              </button>
              <button
                className="cancel-btn"
                onClick={() => setIsAddingList(false)}
              >
                {icons.xButton}
              </button>
            </div>
          </div>
        ) : (
          <button
            className="add-list-btn"
            onClick={() => setIsAddingList(true)}
          >
            {icons.addCard} Add another list
          </button>
        )}
      </div>
    </section>
  )
}
