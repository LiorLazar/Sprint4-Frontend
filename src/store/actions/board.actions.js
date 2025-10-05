import { store } from '../store'
import { ADD_BOARD, REMOVE_BOARD, SET_BOARDS, SET_BOARD, UPDATE_BOARD, ADD_BOARD_MSG } from '../reducers/board.reducer'
import { boardService } from '../../services/board/board.service.local.js'

export async function loadBoards(filterBy) {
    try {
        // const boards = await boardService.query(filterBy)
        const boards = await boardService.query()

        store.dispatch(getCmdSetBoards(boards))

        return boards
    } catch (err) {
        console.log('Cannot load boards', err)
        throw err
    }
}

export async function loadBoard(boardId) {
    try {
        const board = await boardService.getById(boardId)
        store.dispatch(getCmdSetBoard(board))
    } catch (err) {
        console.log('Cannot load board', err)
        throw err
    }
}


export async function removeBoard(boardId) {
    try {
        await boardService.remove(boardId)
        store.dispatch(getCmdRemoveBoard(boardId))
    } catch (err) {
        console.log('Cannot remove board', err)
        throw err
    }
}

export async function addBoard(board) {
    try {
        const savedBoard = await boardService.save(board)
        store.dispatch(getCmdAddBoard(savedBoard))
        return savedBoard
    } catch (err) {
        console.log('Cannot add board', err)
        throw err
    }
}

export async function updateBoard(board) {
    try {
        const savedBoard = await boardService.save(board)
        store.dispatch(getCmdUpdateBoard(savedBoard))
        return savedBoard
    } catch (err) {
        console.log('Cannot save board', err)
        throw err
    }
}

export async function addBoardMsg(boardId, txt) {
    try {
        const msg = await boardService.addBoardMsg(boardId, txt)
        store.dispatch(getCmdAddBoardMsg(msg))
        return msg
    } catch (err) {
        console.log('Cannot add board msg', err)
        throw err
    }
}

export async function createRandomBoard() {
    try {
        const savedBoard = await boardService._createRandomBoard()
        store.dispatch(getCmdAddBoard(savedBoard))
        return savedBoard
    } catch (err) {
        console.log('Cannot create random board', err)
        throw err
    }
}

export async function updateRecentlyViewed(boardId) {
    try {
        const updatedBoard = await boardService.updateRecentlyViewed(boardId)
        store.dispatch(getCmdUpdateBoard(updatedBoard))
        return updatedBoard
    } catch (err) {
        console.log('Cannot update recently viewed', err)
        throw err
    }
}

// Command Creators:
function getCmdSetBoards(boards) {
    return {
        type: SET_BOARDS,
        boards
    }
}
function getCmdSetBoard(board) {
    return {
        type: SET_BOARD,
        board
    }
}
function getCmdRemoveBoard(boardId) {
    return {
        type: REMOVE_BOARD,
        boardId
    }
}
function getCmdAddBoard(board) {
    return {
        type: ADD_BOARD,
        board
    }
}
function getCmdUpdateBoard(board) {
    return {
        type: UPDATE_BOARD,
        board
    }
}
function getCmdAddBoardMsg(msg) {
    return {
        type: ADD_BOARD_MSG,
        msg
    }
}

// unitTestActions()
async function unitTestActions() {
    await loadBoards()
    await addBoard({ title: 'New Board', isStarred: false })
    await updateBoard({
        _id: 'm1oC7',
        title: 'Updated Board Title',
        isStarred: true
    })
    await removeBoard('m1oC7')
    // TODO unit test addBoardMsg
}
