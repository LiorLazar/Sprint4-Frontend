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

  const [localBoard, setLocalBoard] = useState(null)
  const [selectedTask, setSelectedTask] = useState(null)
  const [isTaskDetailsOpen, setIsTaskDetailsOpen] = useState(false)
  const [isAddingList, setIsAddingList] = useState(false)
  const [newListTitle, setNewListTitle] = useState('')
  const addListRef = useRef(null)
  const listsContainerRef = useRef(null)

  useEffect(() => {
    if (boardId) loadBoard(boardId)
  }, [boardId])

  useEffect(() => {
    if (board) setLocalBoard(board)
  }, [board])

  useEffect(() => {
    if (localBoard && taskId) {
      const task = localBoard.lists
        .flatMap(list => list.tasks)
        .find(task => task.id === taskId)
      if (task) {
        setSelectedTask(task)
        setIsTaskDetailsOpen(true)
      } else navigate(`/board/${boardId}`)
    } else if (localBoard && !taskId) {
      setSelectedTask(null)
      setIsTaskDetailsOpen(false)
    }
  }, [localBoard, taskId, boardId, navigate])

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
    const updatedLists = localBoard.lists.map(list => ({
      ...list,
      tasks: list.tasks.map(task =>
        task.id === updatedTask.id ? updatedTask : task
      ),
    }))
    const updatedBoard = { ...localBoard, lists: updatedLists }
    setLocalBoard(updatedBoard)
    updateBoard(updatedBoard)
  }

  async function onDeleteTask(taskId) {
    const updatedLists = localBoard.lists.map(list => ({
      ...list,
      tasks: list.tasks.filter(task => task.id !== taskId),
    }))
    const updatedBoard = { ...localBoard, lists: updatedLists }
    setLocalBoard(updatedBoard)
    updateBoard(updatedBoard)
    onCloseTaskDetails()
  }

  function focusOnNewTask(listId) {
    setTimeout(() => {
      const listEl = document.querySelector(`[data-list-id="${listId}"]`)
      if (listEl) {
        listEl.scrollIntoView({ behavior: 'smooth', block: 'center' })
        const input = listEl.querySelector('input, textarea, button')
        input?.focus()
      }
    }, 120)
  }

  function focusOnNewList() {
    setTimeout(() => {
      const newListEl = listsContainerRef.current?.lastElementChild
      newListEl?.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'end' })
      const input = newListEl?.querySelector('input, textarea, button')
      input?.focus()
    }, 120)
  }

  async function onAddListConfirm() {
    const title = newListTitle.trim()
    if (!title) {
      setIsAddingList(false)
      setNewListTitle('')
      return
    }
    const newList = { id: utilService.makeId(), title, tasks: [] }
    const updatedBoard = { ...localBoard, lists: [...localBoard.lists, newList] }
    setLocalBoard(updatedBoard)
    updateBoard(updatedBoard)
    setNewListTitle('')
    setIsAddingList(true)
    focusOnNewList()
  }

  async function onRenameList(listId, newTitle) {
    const trimmed = newTitle.trim()
    if (!trimmed) return onCancelEmptyList(listId)
    const updatedLists = localBoard.lists.map(list =>
      list.id === listId ? { ...list, title: trimmed } : list
    )
    const updatedBoard = { ...localBoard, lists: updatedLists }
    setLocalBoard(updatedBoard)
    updateBoard(updatedBoard)
  }

  async function onAddCard(listId, title) {
    const t = title.trim()
    if (!t) return
    const newTask = { id: utilService.makeId(), title: t, createdAt: Date.now() }
    const updatedLists = localBoard.lists.map(list =>
      list.id === listId ? { ...list, tasks: [...list.tasks, newTask] } : list
    )
    const updatedBoard = { ...localBoard, lists: updatedLists }
    setLocalBoard(updatedBoard)
    updateBoard(updatedBoard)
    focusOnNewTask(listId)
  }

  async function onCancelEmptyList(listId) {
    const list = localBoard.lists.find(l => l.id === listId)
    if (!list || list.tasks.length > 0) return
    const updatedLists = localBoard.lists.filter(l => l.id !== listId)
    const updatedBoard = { ...localBoard, lists: updatedLists }
    setLocalBoard(updatedBoard)
    updateBoard(updatedBoard)
  }

  if (!localBoard) return <div>Loading board...</div>

  return (
    <section className="board-details">
      <BoardHeader />
      <div className="lists-container" ref={listsContainerRef}>
        {localBoard.lists.map(list => (
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
