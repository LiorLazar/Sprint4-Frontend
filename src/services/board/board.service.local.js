import { utilService } from '../util.service.js'
import { storageService } from '../async-storage.service.js'
import { demoBoard } from '../data.js'

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
    getEmptyTask,
    createDemoBoard,
    _createRandomBoard,
}

window.cs = boardService

async function query() {
    let boards = await storageService.query(STORAGE_KEY)
    if (!boards?.length) {
        const demo = createDemoBoard()
        const saved = await storageService.post(STORAGE_KEY, demo)
        boards = [saved]
    }
    return boards
}

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

function createDemoBoard() {
    return structuredClone(demoBoard)
}

async function _createRandomBoard() {
    const board = getEmptyBoard()
    board.title = 'Random Board'
    board.style.backgroundColor = '#ffb84d'
    return save(board)
}
