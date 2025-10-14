import { store } from '../store'
import {
    ADD_BOARD,
    REMOVE_BOARD,
    SET_BOARDS,
    SET_BOARD,
    UPDATE_BOARD,
    ADD_BOARD_MSG
} from '../reducers/board.reducer'
import { boardService } from '../../services/board/board.service.local.js'

export async function loadBoards(filterBy) {
    try {
        const boards = await boardService.query(filterBy)
        store.dispatch({ type: SET_BOARDS, boards })
        return boards
    } catch (err) {
        console.log('Cannot load boards', err)
        throw err
    }
}

export async function loadBoard(boardId) {
    try {
        const board = await boardService.getById(boardId)
        store.dispatch({ type: SET_BOARD, board })
        return board
    } catch (err) {
        console.log('Cannot load board', err)
        throw err
    }
}

export async function removeBoard(boardId) {
    try {
        await boardService.remove(boardId)
        store.dispatch({ type: REMOVE_BOARD, boardId })
    } catch (err) {
        console.log('Cannot remove board', err)
        throw err
    }
}

export async function addBoard(board) {
    try {
        const savedBoard = await boardService.save(board)
        store.dispatch({ type: ADD_BOARD, board: savedBoard })
        return savedBoard
    } catch (err) {
        console.log('Cannot add board', err)
        throw err
    }
}

export async function updateBoard(board) {
    try {
        const savedBoard = await boardService.save(board)
        store.dispatch({ type: UPDATE_BOARD, board: savedBoard })
        return savedBoard
    } catch (err) {
        console.log('Cannot save board', err)
        throw err
    }
}

export async function addBoardMsg(boardId, txt) {
    try {
        const msg = await boardService.addBoardMsg(boardId, txt)
        store.dispatch({ type: ADD_BOARD_MSG, msg })
        return msg
    } catch (err) {
        console.log('Cannot add board msg', err)
        throw err
    }
}

export async function createRandomBoard() {
    try {
        const savedBoard = await boardService._createRandomBoard()
        store.dispatch({ type: ADD_BOARD, board: savedBoard })
        return savedBoard
    } catch (err) {
        console.log('Cannot create random board', err)
        throw err
    }
}

export async function updateRecentlyViewed(boardId) {
    try {
        const updatedBoard = await boardService.updateRecentlyViewed(boardId)
        store.dispatch({ type: UPDATE_BOARD, board: updatedBoard })
        return updatedBoard
    } catch (err) {
        console.log('Cannot update recently viewed', err)
        throw err
    }
}
