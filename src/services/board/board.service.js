import { utilService } from '../util.service.js'
import { storageService } from '../async-storage.service.js'

const STORAGE_KEY = 'boardDB'

export const boardService = {
    query,
    getById,
    save,
    remove,
    getEmptyBoard,
    getEmptyList,
    getEmptyTask,
    createDemoBoard,
}

async function query() {
    let boards = await storageService.query(STORAGE_KEY)
    if (!boards || !boards.length) {
        const demo = createDemoBoard()
        const savedBoard = await storageService.post(STORAGE_KEY, demo)
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

function getEmptyBoard() {
    return {
        title: 'New Board',
        lists: [],
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
        createdAt: Date.now(),
    }
}

function createDemoBoard() {
    return {
        title: 'Demo Board',
        lists: [
            {
                id: utilService.makeId(),
                title: 'Group 1',
                tasks: [
                    { id: utilService.makeId(), title: 'Replace logo' },
                    { id: utilService.makeId(), title: 'Add Samples' },
                    { id: utilService.makeId(), title: 'בדיקה' },
                ],
            },
            {
                id: utilService.makeId(),
                title: 'Group 2',
                tasks: [
                    { id: utilService.makeId(), title: 'Do that' },
                    { id: utilService.makeId(), title: 'Help me' },
                ],
            },
            {
                id: utilService.makeId(),
                title: 'Group 3',
                tasks: [
                    { id: utilService.makeId(), title: 'Task A' },
                    { id: utilService.makeId(), title: 'Task B' },
                    { id: utilService.makeId(), title: 'Task C' },
                ],
            },
        ],
    }
}
