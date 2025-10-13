import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { TaskList } from '../../cmps/BoardDetails/TaskList.jsx'
import { TaskDetails } from '../../cmps/BoardDetails/TaskDetails.jsx'
import { utilService } from '../../services/util.service.js'
import { icons } from '../../cmps/SvgIcons.jsx'
import { BoardHeader } from '../../cmps/BoardDetails/BoardHeader.jsx'
import { loadBoard, updateBoard } from '../../store/actions/board.actions.js'

export function BoardDetails() {
  const { boardId, taskId } = useParams()
  const navigate = useNavigate()
  const board = useSelector(storeState => storeState.boardModule.board)

  const [selectedTask, setSelectedTask] = useState(null)
  const [isTaskDetailsOpen, setIsTaskDetailsOpen] = useState(false)
  const [isAddingList, setIsAddingList] = useState(false)
  const [newListTitle, setNewListTitle] = useState('')
  const addListRef = useRef(null)
  const listsContainerRef = useRef(null)

  // טוען את הלוח מה־Redux כשיש שינוי ב־boardId
  useEffect(() => {
    if (boardId) loadBoard(boardId)
  }, [boardId])

  // ניהול פרטי הטאסק לפי taskId ב־URL
  useEffect(() => {
    if (board && taskId) {
      const task = board.lists
        .flatMap(list => list.tasks)
        .find(task => task.id === taskId)

      if (task) {
        setSelectedTask(task)
        setIsTaskDetailsOpen(true)
      } else {
        navigate(`/board/${boardId}`)
      }
    } else if (board && !taskId) {
      setSelectedTask(null)
      setIsTaskDetailsOpen(false)
    }
  }, [board, taskId, boardId, navigate])

  // סגירת מצב הוספת רשימה בלחיצה מחוץ
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

  function onTaskClick(task) {
    setSelectedTask(task)
    setIsTaskDetailsOpen(true)
    navigate(`/board/${boardId}/card/${task.id}`)
  }

  function onCloseTaskDetails() {
    setSelectedTask(null)
    setIsTaskDetailsOpen(false)
    navigate(`/board/${boardId}`)
  }

  async function onSaveTask(updatedTask) {
    const updatedLists = board.lists.map(list => ({
      ...list,
      tasks: list.tasks.map(task =>
        task.id === updatedTask.id ? updatedTask : task
      ),
    }))
    const updatedBoard = { ...board, lists: updatedLists }
    await updateBoard(updatedBoard)
  }

  async function onDeleteTask(taskId) {
    const updatedLists = board.lists.map(list => ({
      ...list,
      tasks: list.tasks.filter(task => task.id !== taskId),
    }))
    const updatedBoard = { ...board, lists: updatedLists }
    await updateBoard(updatedBoard)
    onCloseTaskDetails()
  }

  async function onAddListConfirm() {
    const title = newListTitle.trim()
    if (!title) {
      setIsAddingList(false)
      setNewListTitle('')
      return
    }

    const newList = { id: utilService.makeId(), title, tasks: [] }
    const updatedBoard = { ...board, lists: [...board.lists, newList] }
    await updateBoard(updatedBoard)
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

  async function onRenameList(listId, newTitle) {
    const trimmed = newTitle.trim()
    if (!trimmed) return onCancelEmptyList(listId)
    const updatedLists = board.lists.map(list =>
      list.id === listId ? { ...list, title: trimmed } : list
    )
    const updatedBoard = { ...board, lists: updatedLists }
    await updateBoard(updatedBoard)
  }

  async function onAddCard(listId, title) {
    const t = title.trim()
    if (!t) return
    const newTask = { id: utilService.makeId(), title: t, createdAt: Date.now() }
    const updatedLists = board.lists.map(list =>
      list.id === listId ? { ...list, tasks: [...list.tasks, newTask] } : list
    )
    const updatedBoard = { ...board, lists: updatedLists }
    await updateBoard(updatedBoard)
  }

  async function onCancelEmptyList(listId) {
    const list = board.lists.find(l => l.id === listId)
    if (!list || list.tasks.length > 0) return
    const updatedLists = board.lists.filter(l => l.id !== listId)
    const updatedBoard = { ...board, lists: updatedLists }
    await updateBoard(updatedBoard)
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
            onTaskClick={onTaskClick}
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

      <TaskDetails
        task={selectedTask}
        isOpen={isTaskDetailsOpen}
        onClose={onCloseTaskDetails}
        onSave={onSaveTask}
        onDelete={onDeleteTask}
      />
    </section>
  )
}
