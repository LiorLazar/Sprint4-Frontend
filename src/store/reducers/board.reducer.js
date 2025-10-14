export const SET_BOARDS = 'SET_BOARDS'
export const SET_BOARD = 'SET_BOARD'
export const REMOVE_BOARD = 'REMOVE_BOARD'
export const ADD_BOARD = 'ADD_BOARD'
export const UPDATE_BOARD = 'UPDATE_BOARD'
export const ADD_BOARD_MSG = 'ADD_BOARD_MSG'

const initialState = {
    boards: [],
    board: null
}

export function boardReducer(state = initialState, action) {
    switch (action.type) {
        case SET_BOARDS:
            return { ...state, boards: action.boards }

        case SET_BOARD:
            return { ...state, board: action.board }

        case REMOVE_BOARD: {
            const boards = state.boards.filter(board => board._id !== action.boardId)
            return { ...state, boards }
        }

        case ADD_BOARD:
            return { ...state, boards: [...state.boards, action.board] }

        case UPDATE_BOARD: {
            const boards = state.boards.map(board =>
                board._id === action.board._id ? action.board : board
            )
            // אם הלוח הפתוח כרגע הוא זה שהתעדכן – נעדכן גם אותו
            const board =
                state.board?._id === action.board._id ? action.board : state.board

            return { ...state, boards, board }
        }

        case ADD_BOARD_MSG:
            if (!state.board) return state
            const updatedMsgs = [...(state.board.msgs || []), action.msg]
            return { ...state, board: { ...state.board, msgs: updatedMsgs } }

        default:
            return state
    }
}


// unitTestReducer()

function unitTestReducer() {
    var state = initialState
    const board1 = { _id: 'b101', title: 'Board ' + parseInt('' + Math.random() * 10), isStarred: false, owner: null, msgs: [] }
    const board2 = { _id: 'b102', title: 'Board ' + parseInt('' + Math.random() * 10), isStarred: true, owner: null, msgs: [] }

    state = boardReducer(state, { type: SET_BOARDS, boards: [board1] })
    console.log('After SET_BOARDS:', state)

    state = boardReducer(state, { type: ADD_BOARD, board: board2 })
    console.log('After ADD_BOARD:', state)

    state = boardReducer(state, { type: UPDATE_BOARD, board: { ...board2, title: 'Updated Title' } })
    console.log('After UPDATE_BOARD:', state)

    state = boardReducer(state, { type: REMOVE_BOARD, boardId: board2._id })
    console.log('After REMOVE_BOARD:', state)

    state = boardReducer(state, { type: SET_BOARD, board: board1 })
    console.log('After SET_BOARD:', state)

    const msg = { id: 'm' + parseInt('' + Math.random() * 100), txt: 'Some msg', by: { _id: 'u123', fullname: 'test' } }
    state = boardReducer(state, { type: ADD_BOARD_MSG, boardId: board1._id, msg })
    console.log('After ADD_BOARD_MSG:', state)
}

