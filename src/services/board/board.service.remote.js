import { httpService } from '../http.service'

export const boardService = {
    query,
    getById,
    save,
    remove,
    addCarMsg
}

async function query(filterBy = { txt: '' }) {
    return httpService.get(`board`, filterBy)
}

function getById(board) {
    return httpService.get(`board/${carId}`)
}

async function remove(board) {
    return httpService.delete(`board/${carId}`)
}
async function save(board) {
    var savedBoard
    if (board._id) {
        savedBoard = await httpService.put(`board/${board._id}`, board)
    } else {
        savedBoard = await httpService.post('board', car)
    }
    return savedBoard
}

async function addCarMsg(boardId, txt) {
    const savedMsg = await httpService.post(`board/${boardId}/msg`, { txt })
    return savedMsg
}