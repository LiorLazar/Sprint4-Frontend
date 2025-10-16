import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { BoardHeader } from '../../cmps/BoardDetails/BoardHeader.jsx'
import { TaskList } from '../../cmps/BoardDetails/TaskList.jsx'
import { TaskDetails } from '../../cmps/TaskDetails/TaskDetails.jsx'

import { utilService } from '../../services/util.service.js'
import { icons } from '../../cmps/SvgIcons.jsx'

import { loadBoard, updateBoard } from '../../store/actions/board.actions.js'

export function BoardDetails() {
  const { boardId, taskId } = useParams()
  const navigate = useNavigate()
  const boardFromStore = useSelector(storeState => storeState.boardModule.board)

  const [localBoard, setLocalBoard] = useState(null)
  const [selectedTask, setSelectedTask] = useState(null)
  const [isTaskDetailsOpen, setIsTaskDetailsOpen] = useState(false)
  const [isAddingList, setIsAddingList] = useState(false)
  const [newListTitle, setNewListTitle] = useState('')
  const addListFormRef = useRef(null)
  const listsContainerRef = useRef(null)

  useEffect(() => {
    if (boardId) loadBoard(boardId)
  }, [boardId])

  useEffect(() => {
    if (boardFromStore) setLocalBoard(boardFromStore)
  }, [boardFromStore])

  useEffect(() => {
    if (localBoard && taskId) {
      const foundTask = localBoard.lists
        .flatMap(list => list.tasks)
        .find(task => task.id === taskId)

      if (foundTask) {
        setSelectedTask(foundTask)
        setIsTaskDetailsOpen(true)
      } else {
        navigate(`/board/${boardId}`)
      }
    } else if (localBoard && !taskId) {
      setSelectedTask(null)
      setIsTaskDetailsOpen(false)
    }
  }, [localBoard, taskId, boardId, navigate])

  useEffect(() => {
    function handleClickOutside(event) {
      if (!isAddingList) return
      if (addListFormRef.current && !addListFormRef.current.contains(event.target)) {
        setIsAddingList(false)
        setNewListTitle('')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isAddingList])

  function handleTaskClick(task) {
    setSelectedTask(task)
    setIsTaskDetailsOpen(true)
    navigate(`/board/${boardId}/card/${task.id}`)
  }

  function handleCloseTaskDetails() {
    setSelectedTask(null)
    setIsTaskDetailsOpen(false)
    navigate(`/board/${boardId}`)
  }

  async function handleSaveTask(updatedTask) {
    const updatedLists = localBoard.lists.map(list => {
      const hasTask = list.tasks.some(taskItem => taskItem.id === updatedTask.id)
      if (!hasTask) return list
      return {
        ...list,
        tasks: list.tasks.map(taskItem =>
          taskItem.id === updatedTask.id ? { ...taskItem, ...updatedTask } : taskItem
        ),
      }
    })

    const updatedBoard = { ...localBoard, lists: updatedLists }
    setLocalBoard(updatedBoard)
    await updateBoard(updatedBoard)
  }

  async function handleDeleteTask(taskIdToDelete) {
    const updatedLists = localBoard.lists.map(list => ({
      ...list,
      tasks: list.tasks.filter(taskItem => taskItem.id !== taskIdToDelete),
    }))
    const updatedBoard = { ...localBoard, lists: updatedLists }
    setLocalBoard(updatedBoard)
    updateBoard(updatedBoard)
    handleCloseTaskDetails()
  }

  function focusOnNewTask(listId) {
    setTimeout(() => {
      const listElement = document.querySelector(`[data-list-id="${listId}"]`)
      if (listElement) {
        listElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
        const inputElement = listElement.querySelector('input, textarea, button')
        inputElement?.focus()
      }
    }, 120)
  }

  function focusOnNewList() {
    setTimeout(() => {
      const newListElement = listsContainerRef.current?.lastElementChild
      newListElement?.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'end' })
      const inputElement = newListElement?.querySelector('input, textarea, button')
      inputElement?.focus()
    }, 120)
  }

  async function handleAddListConfirm() {
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

  async function handleRenameList(listId, newTitle) {
    const trimmedTitle = newTitle.trim()
    if (!trimmedTitle) return handleCancelEmptyList(listId)

    const updatedLists = localBoard.lists.map(list =>
      list.id === listId ? { ...list, title: trimmedTitle } : list
    )
    const updatedBoard = { ...localBoard, lists: updatedLists }
    setLocalBoard(updatedBoard)
    updateBoard(updatedBoard)
  }

  async function handleAddCard(listId, cardTitle) {
    const trimmedTitle = cardTitle.trim()
    if (!trimmedTitle) return

    const newTask = {
      id: utilService.makeId(),
      title: trimmedTitle,
      createdAt: Date.now(),
      dueDate: null,
    }

    const updatedLists = localBoard.lists.map(list =>
      list.id === listId ? { ...list, tasks: [...list.tasks, newTask] } : list
    )

    const updatedBoard = { ...localBoard, lists: updatedLists }
    setLocalBoard(updatedBoard)
    updateBoard(updatedBoard)
    focusOnNewTask(listId)
  }

  async function handleCancelEmptyList(listId) {
    const foundList = localBoard.lists.find(list => list.id === listId)
    if (!foundList || foundList.tasks.length > 0) return

    const updatedLists = localBoard.lists.filter(list => list.id !== listId)
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
            onCancelEmptyList={handleCancelEmptyList}
            onRenameList={handleRenameList}
            onAddCard={handleAddCard}
            onTaskClick={handleTaskClick}
          />
        ))}

        {isAddingList ? (
          <div className="tasks-list add-list-form" ref={addListFormRef}>
            <input
              type="text"
              className="list-title-input"
              placeholder="Enter list name..."
              value={newListTitle}
              onChange={event => setNewListTitle(event.target.value)}
              onKeyDown={event => event.key === 'Enter' && handleAddListConfirm()}
              autoFocus
            />
            <div className="add-card-actions">
              <button className="add-card-btn" onClick={handleAddListConfirm}>
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
        onClose={handleCloseTaskDetails}
        onSave={handleSaveTask}
        onDelete={handleDeleteTask}
      />
    </section>
  )
}
