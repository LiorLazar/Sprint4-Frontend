import { storageService } from '../async-storage.service'

const STORAGE_KEY = 'board'

export const boardService = {
    query,
    getById,
    save,
    remove,
    _createRandomBoard,
    updateRecentlyViewed,
}
window.cs = boardService

async function query() {
    return await storageService.query(STORAGE_KEY)
}

function getById(boardId) {
    return storageService.get(STORAGE_KEY, boardId)
}

async function remove(boardId) {
    // throw new Error('Nope')
    await storageService.remove(STORAGE_KEY, boardId)
}

async function save(board) {
    var savedBoard
    if (board._id) {
        const boardToSave = {
            _id: board._id,
            title: board.title,
            isStarred: board.isStarred,
            recentlyViewed: board.recentlyViewed || null,
        }
        savedBoard = await storageService.put(STORAGE_KEY, boardToSave)
    } else {
        const boardToSave = {
            title: board.title,
            isStarred: board.isStarred || false,
            recentlyViewed: null,
            // Later, owner is set by the backend
            // owner: userService.getLoggedinUser(),
            // msgs: []
        }
        savedBoard = await storageService.post(STORAGE_KEY, boardToSave)
    }
    return savedBoard
}

async function updateRecentlyViewed(boardId) {
    // Get the specific board
    const board = await getById(boardId)
    
    if (board) {
        // Set the current date/time for this board
        board.recentlyViewed = new Date().toISOString()
        
        // Save the updated board
        await storageService.put(STORAGE_KEY, board)
        return board
    }
    
    return null
}

async function _createRandomBoard() {
    const titles = ['Project Apollo', 'Marketing Plan', 'Sprint Tasks', 'Product Launch', 'Event Planning']
    const randomTitle = titles[Math.floor(Math.random() * titles.length)]
    const board = {
        title: randomTitle,
        isStarred: false,
        recentlyViewed: null,
    }
    
    // Save the board and return the saved result
    return await save(board)
}

// async function addBoardMsg(boardId, txt) {
//     // Later, this is all done by the backend
//     const board = await getById(boardId)

//     const msg = {
//         id: makeId(),
//         by: userService.getLoggedinUser(),
//         txt
//     }
//     board.msgs.push(msg)
//     await storageService.put(STORAGE_KEY, board)

//     return msg
// }

// const board = {
// 	title: 'Robot dev proj',
// 	isStarred: false,
// 	archivedAt: 1589983468418,
// 	createdBy: {
// 		_id: 'u101',
// 		fullname: 'Abi Abambi',
// 		imgUrl: 'http://some-img',
// 	},
// 	style: {
// 		backgroundImage: '',
// 	},
// 	labels: [
// 		{
// 			id: 'l101',
// 			title: 'Done',
// 			color: '#61bd4f',
// 		},
// 		{
// 			id: 'l102',
// 			title: 'Progress',
// 			color: '#61bd33',
// 		},
// 	],
// 	members: [
// 		{
// 			_id: 'u101',
// 			fullname: 'Tal Taltal',
// 			imgUrl: 'https://www.google.com',
// 		},
// 		{
// 			_id: 'u102',
// 			fullname: 'Josh Ga',
// 			imgUrl: 'https://www.google.com',
// 		},
// 	],
// 	groups: [
// 		{
// 			id: 'g101',
// 			title: 'Group 1',
// 			archivedAt: 1589983468418,
// 			tasks: [
// 				{
// 					id: 'c101',
// 					title: 'Replace logo',
// 				},
// 				{
// 					id: 'c102',
// 					title: 'Add Samples',
// 				},
// 			],
// 			style: {},
// 		},
// 		{
// 			id: 'g102',
// 			title: 'Group 2',
// 			tasks: [
// 				{
// 					id: 'c103',
// 					title: 'Do that',
// 					archivedAt: 1589983468418,
// 				},
// 				{
// 					id: 'c104',
// 					title: 'Help me',
// 					status: 'inProgress', // monday / both
// 					priority: 'high', // monday / both
// 					dueDate: '2024-09-24',
// 					description: 'description',
// 					comments: [
// 						// in Trello this is easier implemented as an activity
// 						{
// 							id: 'ZdPnm',
// 							title: 'also @yaronb please CR this',
// 							createdAt: 1590999817436,
// 							byMember: {
// 								_id: 'u101',
// 								fullname: 'Tal Tarablus',
// 								imgUrl: '',
// 							},
// 						},
// 					],
// 					checklists: [
// 						{
// 							id: 'YEhmF',
// 							title: 'Checklist',
// 							todos: [
// 								{
// 									id: '212jX',
// 									title: 'To Do 1',
// 									isDone: false,
// 								},
// 							],
// 						},
// 					],
// 					memberIds: ['u101'],
// 					labelIds: ['l101', 'l102'],
// 					byMember: {
// 						_id: 'u101',
// 						fullname: 'Tal Tarablus',
// 						imgUrl: '',
// 					},
// 					style: {
// 						backgroundColor: '#26de81',
// 					},
// 				},
// 			],
// 			style: {},
// 		},
// 	],
// 	activities: [
// 		{
// 			id: 'a101',
// 			title: 'Changed Color',
// 			createdAt: 154514,
// 			byMember: {
// 				_id: 'u101',
// 				fullname: 'Abi Abambi',
// 				imgUrl: 'http://some-img',
// 			},
// 			group: {
// 				id: 'g101',
// 				title: 'Urgent Stuff',
// 			},
// 			task: {
// 				id: 'c101',
// 				title: 'Replace Logo',
// 			},
// 		},
// 	],
// }