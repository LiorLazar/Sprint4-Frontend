import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { BoardHeader } from '../../cmps/BoardDetails/BoardHeader.jsx'
import { TaskList } from '../../cmps/BoardDetails/TaskList.jsx'
import { TaskDetails } from '../../cmps/TaskDetails/TaskDetails.jsx'

import { utilService } from '../../services/util.service.js'
import { icons } from '../../cmps/SvgIcons.jsx'
import { loadBoard, updateBoard } from '../../store/actions/board.actions.js'
const { adjustColorBrightness, getAverageColor } = utilService


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

  // ===== LOAD BOARD =====
  useEffect(() => {
    if (boardId) loadBoard(boardId)
  }, [boardId])

  useEffect(() => {
    if (boardFromStore) setLocalBoard(boardFromStore)
  }, [boardFromStore])

  // ===== SET BACKGROUND COLOR OR IMAGE =====
  useEffect(() => {
    const bgColor = localBoard?.style?.backgroundColor || '#838c91'
    const bgImage = localBoard?.style?.backgroundImage || null

    if (bgImage) {
      document.body.style.backgroundImage = `url(${bgImage})`
      document.body.style.backgroundSize = 'cover'
      document.body.style.backgroundPosition = 'center center'
      document.body.style.backgroundAttachment = 'fixed'
      document.body.style.backgroundRepeat = 'no-repeat'
      document.body.style.backgroundColor = 'transparent'

      getAverageColor(bgImage).then(avgColor => {
        const darker = adjustColorBrightness(avgColor, -15)
        const textColor = adjustColorBrightness(avgColor, 100)

        document.documentElement.style.setProperty('--app-header-backgrd-clr1', darker)
        document.documentElement.style.setProperty('--app-header-text-clr1', textColor)
        document.documentElement.style.setProperty('--header-bckgrd-clr1', 'transparent')
        document.documentElement.style.setProperty('--header-text-clr1', '#fff')
        document.documentElement.style.setProperty('--header-backdrop-blur', '18px')
      })
    } else {
      document.body.style.backgroundImage = 'none'
      document.body.style.backgroundColor = bgColor

      const baseColor = bgColor || '#838c91'
      const boardHeaderBg = adjustColorBrightness(baseColor, -12)
      const appHeaderBg = adjustColorBrightness(baseColor, -25)
      const headerText = adjustColorBrightness(baseColor, 60)

      document.documentElement.style.setProperty('--app-header-backgrd-clr1', appHeaderBg)
      document.documentElement.style.setProperty('--app-header-text-clr1', headerText)
      document.documentElement.style.setProperty('--header-bckgrd-clr1', boardHeaderBg)
      document.documentElement.style.setProperty('--header-text-clr1', headerText)
      document.documentElement.style.removeProperty('--header-backdrop-blur')
    }

    return () => {
      document.body.style.backgroundImage = 'none'
      document.body.style.backgroundColor = '#838c91'
      document.documentElement.style.removeProperty('--app-header-backgrd-clr1')
      document.documentElement.style.removeProperty('--app-header-text-clr1')
      document.documentElement.style.removeProperty('--header-bckgrd-clr1')
      document.documentElement.style.removeProperty('--header-text-clr1')
      document.documentElement.style.removeProperty('--header-backdrop-blur')
    }
  }, [localBoard?.style?.backgroundColor, localBoard?.style?.backgroundImage])

  // ===== HANDLE SELECTED TASK =====
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

  // ===== CLICK OUTSIDE ADD-LIST =====
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

  // ===== TASK DETAILS OPEN/CLOSE =====
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

  // ===== MOVE TASK (DnD Core) =====
  async function handleMoveTask(taskId, fromListId, toListId, targetIndex) {
    if (!localBoard) return

    const boardCopy = structuredClone(localBoard)

    const fromList = boardCopy.lists.find(list => list.id === fromListId)
    const toList = boardCopy.lists.find(list => list.id === toListId)
    if (!fromList || !toList) return

    const task = fromList.tasks.find(t => t.id === taskId)
    if (!task) return

    // Remove from source
    fromList.tasks = fromList.tasks.filter(t => t.id !== taskId)

    // Insert into target
    if (targetIndex == null || targetIndex >= toList.tasks.length) {
      toList.tasks.push(task)
    } else {
      toList.tasks.splice(targetIndex, 0, task)
    }

    setLocalBoard(boardCopy)
    await updateBoard(boardCopy)
  }

  // ===== SAVE / DELETE TASK =====
async function handleSaveTask(updatedTask, updatedBoard = null) {
  if (!localBoard) return

  if (updatedBoard) {
    const mergedBoard = {
      ...localBoard,
      ...updatedBoard,
      activityLog: [
        ...(localBoard.activityLog || []),
        ...((updatedBoard.activityLog || []).filter(
          act => !(localBoard.activityLog || []).some(a => a.id === act.id)
        ))
      ]
    }

    setLocalBoard(mergedBoard)
    await updateBoard(mergedBoard)
    return
  }

  const updatedBoardWithTask = {
    ...localBoard,
    lists: localBoard.lists.map(list => ({
      ...list,
      tasks: list.tasks.map(task =>
        task.id === updatedTask.id ? { ...task, ...updatedTask } : task
      )
    }))
  }

  setLocalBoard(updatedBoardWithTask)
  await updateBoard(updatedBoardWithTask)
}

  async function handleDeleteTask(taskIdToDelete) {
    const updatedBoard = {
      ...localBoard,
      lists: localBoard.lists.map(list => ({
        ...list,
        tasks: list.tasks.filter(taskItem => taskItem.id !== taskIdToDelete)
      }))
    }
    setLocalBoard(updatedBoard)
    await updateBoard(updatedBoard)
    handleCloseTaskDetails()
  }

  // ===== ADD / RENAME / CANCEL LIST =====
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
    await updateBoard(updatedBoard)
    setNewListTitle('')
    setIsAddingList(true)
    focusOnNewList()
  }

  async function handleRenameList(listId, newTitle) {
    const trimmedTitle = newTitle.trim()
    if (!trimmedTitle) return handleCancelEmptyList(listId)

    const updatedBoard = {
      ...localBoard,
      lists: localBoard.lists.map(list =>
        list.id === listId ? { ...list, title: trimmedTitle } : list
      )
    }

    setLocalBoard(updatedBoard)
    await updateBoard(updatedBoard)
  }

  async function handleCancelEmptyList(listId) {
    const foundList = localBoard.lists.find(list => list.id === listId)
    if (!foundList || foundList.tasks.length > 0) return

    const updatedBoard = {
      ...localBoard,
      lists: localBoard.lists.filter(list => list.id !== listId)
    }

    setLocalBoard(updatedBoard)
    await updateBoard(updatedBoard)
  }

  // ===== ADD CARD =====
  async function handleAddCard(listId, cardTitle) {
    const trimmedTitle = cardTitle.trim()
    if (!trimmedTitle) return

    const newTask = {
      id: utilService.makeId(),
      title: trimmedTitle,
      createdAt: Date.now(),
      dueDate: null
    }

    const updatedBoard = {
      ...localBoard,
      lists: localBoard.lists.map(list =>
        list.id === listId ? { ...list, tasks: [...list.tasks, newTask] } : list
      )
    }

    setLocalBoard(updatedBoard)
    await updateBoard(updatedBoard)
    focusOnNewTask(listId)
  }

  // ===== FOCUS HELPERS =====
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

  if (!localBoard) return <div>Loading board...</div>

  const currentListTitle =
    localBoard?.lists.find(list =>
      list.tasks.some(t => t.id === selectedTask?.id)
    )?.title || ''

  const hasImageBg = Boolean(localBoard?.style?.backgroundImage)

  return (
    <section className="board-details">
      <BoardHeader hasImageBg={hasImageBg} />

      <div className="lists-container" ref={listsContainerRef}>
        {localBoard.lists.map(list => (
          <TaskList
            key={list.id}
            list={list}
            board={localBoard}
            onCancelEmptyList={handleCancelEmptyList}
            onRenameList={handleRenameList}
            onAddCard={handleAddCard}
            onTaskClick={handleTaskClick}
            onSaveTask={handleSaveTask}
            onMoveTask={handleMoveTask}
              onDeleteTask={handleDeleteTask}

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
              <button className="cancel-btn" onClick={() => setIsAddingList(false)}>
                {icons.xButton}
              </button>
            </div>
          </div>
        ) : (
          <button className="add-list-btn" onClick={() => setIsAddingList(true)}>
            {icons.addCard} Add another list
          </button>
        )}
      </div>

      <TaskDetails
        task={selectedTask}
        board={localBoard}
        listTitle={currentListTitle}
        isOpen={isTaskDetailsOpen}
        onClose={handleCloseTaskDetails}
        onSave={handleSaveTask}
        onDelete={handleDeleteTask}
      />
    </section>
  )
}
