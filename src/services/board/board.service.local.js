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
    _createRandomBoard,
    getEmptyBoard,
    getEmptyList,
    getEmptyTask,
    createDemoBoard,
    addChecklistToTask,
    updateChecklistItem,
    removeChecklist,
}

window.cs = boardService

async function query() {
    let boards = await storageService.query(STORAGE_KEY)
    if (!boards || !boards.length) {
        const savedBoard = await storageService.post(STORAGE_KEY, createDemoBoard())
        boards = [savedBoard]
    }
    return boards
}

async function getById(boardId) {
    return storageService.get(STORAGE_KEY, boardId)
}

async function save(board) {
    if (board._id) return storageService.put(STORAGE_KEY, board)
    else return storageService.post(STORAGE_KEY, board)
}

async function remove(boardId) {
    return storageService.remove(STORAGE_KEY, boardId)
}

async function updateRecentlyViewed(boardId) {
    const board = await getById(boardId)
    if (!board) return null
    board.recentlyViewed = new Date().toISOString()
    await storageService.put(STORAGE_KEY, board)
    return board
}

async function addChecklistToTask(boardId, listId, taskId, checklistData) {
    const board = await getById(boardId)
    const list = board.lists.find(l => l.id === listId)
    if (!list) throw new Error('List not found')
    const task = list.tasks.find(t => t.id === taskId)
    if (!task) throw new Error('Task not found')
    const newChecklist = {
        id: utilService.makeId(),
        title: checklistData.title || 'Checklist',
        items: [],
    }
    task.checklists = task.checklists || []
    task.checklists.push(newChecklist)
    await save(board)
    return board
}

async function updateChecklistItem(boardId, listId, taskId, checklistId, updatedItem) {
    const board = await getById(boardId)
    const list = board.lists.find(l => l.id === listId)
    const task = list?.tasks.find(t => t.id === taskId)
    const checklist = task?.checklists?.find(cl => cl.id === checklistId)
    if (!checklist) throw new Error('Checklist not found')
    const idx = checklist.items.findIndex(i => i.id === updatedItem.id)
    if (idx !== -1) checklist.items[idx] = updatedItem
    else checklist.items.push(updatedItem)
    await save(board)
    return board
}

async function removeChecklist(boardId, listId, taskId, checklistId) {
    const board = await getById(boardId)
    const list = board.lists.find(l => l.id === listId)
    const task = list?.tasks.find(t => t.id === taskId)
    if (!task?.checklists) return board
    task.checklists = task.checklists.filter(cl => cl.id !== checklistId)
    await save(board)
    return board
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
    board.title = 'New Random Board'
    board.style.backgroundColor = '#ffb84d'
    return await save(board)
}
