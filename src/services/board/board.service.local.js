import { utilService } from '../util.service.js'
import { storageService } from '../async-storage.service.js'

import { demoBoards } from '../data.js'

const STORAGE_KEY = 'board'

export const boardService = {
    query,
    getById,
    save,
    remove,
    updateRecentlyViewed,
    updateTask,
    getEmptyBoard,
    getEmptyList,
    removeTask,
    getEmptyTask,
    createDemoBoards,
    _createRandomBoard,
}

window.cs = boardService

// ========== LOAD BOARDS ==========
async function query() {
    let boards = await storageService.query(STORAGE_KEY)

    // אם אין לוחות בכלל – צור את כל הדמו־דאטה
    if (!boards?.length) {
        const demoData = createDemoBoards()
        const savedBoards = []
        for (const board of demoData) {
            const saved = await storageService.post(STORAGE_KEY, board)
            savedBoards.push(saved)
        }
        boards = savedBoards
    }

    return boards
}

// ========== CRUD ==========

function getById(boardId) {
    return storageService.get(STORAGE_KEY, boardId)
}

function save(board) {
    return board._id
        ? storageService.put(STORAGE_KEY, board)
        : storageService.post(STORAGE_KEY, board)
}

function remove(boardId) {
    return storageService.remove(STORAGE_KEY, boardId)
}

// ========== HELPERS ==========

async function updateRecentlyViewed(boardId) {
    const board = await getById(boardId)
    if (!board) throw new Error('Board not found')
    board.recentlyViewed = new Date().toISOString()
    return save(board)
}

async function updateTask(boardId, updatedTask) {
    const board = await getById(boardId)
    if (!board) throw new Error('Board not found')

    const newLists = board.lists.map(list => ({
        ...list,
        tasks: list.tasks.map(task =>
            task.id === updatedTask.id ? { ...task, ...updatedTask } : task
        ),
    }))

    const updatedBoard = { ...board, lists: newLists }
    await save(updatedBoard)
    return updatedBoard
}

function getEmptyBoard() {
    return {
        id: utilService.makeId(),
        title: 'New Board',
        createdBy: null,
        isStarred: false,
        style: { backgroundColor: '#0079bf' },
        labels: [],
        members: [],
        lists: [],
        activities: [],
        recentlyViewed: null,
        createdAt: Date.now(),
    }
}

function getEmptyList() {
    return {
        id: utilService.makeId(),
        title: '',
        tasks: [],
    }
}

function getEmptyTask() {
    return {
        id: utilService.makeId(),
        title: '',
        description: '',
        dueDate: null,
        members: [],
        labels: [],
        checklists: [],
        attachments: [],
        createdAt: Date.now(),
    }
}
function removeTask(boardId, taskId) {
    const boards = loadFromStorage(STORAGE_KEY)
    const boardIdx = boards.findIndex(b => b._id === boardId)
    if (boardIdx === -1) return Promise.reject('Board not found')

    const board = boards[boardIdx]
    let isRemoved = false

    board.lists = board.lists.map(list => ({
        ...list,
        tasks: list.tasks.filter(task => {
            if (task.id === taskId) isRemoved = true
            return task.id !== taskId
        })
    }))

    if (!isRemoved) return Promise.reject('Task not found')

    boards[boardIdx] = board
    saveToStorage(STORAGE_KEY, boards)
    return Promise.resolve()
}

// ========== CREATE DEMO BOARDS ==========
function createDemoBoards() {
    return demoBoards.map(board => structuredClone(board))
}

async function _createRandomBoard() {
    const board = getEmptyBoard()
    board.title = 'Random Board'
    board.style.backgroundColor = '#ffb84d'
    return save(board)
}
