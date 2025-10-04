const { DEV, VITE_LOCAL } = import.meta.env

import { boardService as local } from './board.service.local'
// import { boardService as remote } from './board.service.remote'

function getEmptyBoard() {
	return {
		title: 'New Board',
		isStarred: false
	}
}

function getDefaultFilter() {
    return {
        txt: '',
        sortField: '',
        sortDir: '',
    }
}

// For now, always use local service
const service = local
export const boardService = { getEmptyBoard, getDefaultFilter, ...service }

// Easy access to this service from the dev tools console
// when using script - dev / dev:local

if (DEV) window.boardService = boardService
