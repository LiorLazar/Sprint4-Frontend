import { utilService } from '../util.service.js'
import { storageService } from '../async-storage.service.js'

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
}

window.cs = boardService


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


async function updateRecentlyViewed(boardId) {
    const board = await getById(boardId)
    if (!board) return null
    board.recentlyViewed = new Date().toISOString()
    await storageService.put(STORAGE_KEY, board)
    return board
}

async function _createRandomBoard() {
    const titles = ['Project Apollo', 'Marketing Plan', 'Sprint Tasks', 'Product Launch', 'Event Planning']
    const backgroundColors = ['#0079bf', '#d29034', '#519839', '#b04632', '#89609e', '#cd5a91', '#4bbf6b', '#00aecc']

    const randomTitle = titles[Math.floor(Math.random() * titles.length)]
    const randomColor = backgroundColors[Math.floor(Math.random() * backgroundColors.length)]

    const board = {
        title: randomTitle,
        isStarred: false,
        recentlyViewed: null,
        style: { backgroundColor: randomColor },
    }

    return await save(board)
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
        _id: utilService.makeId(),
        title: 'Team Collaboration Board',
        isStarred: true,
        createdAt: Date.now(),
        createdBy: {
            _id: 'u101',
            fullname: 'Eden Avgi',
            imgUrl: 'https://i.pravatar.cc/150?img=3',
        },
        style: {
            backgroundColor: '#7a8287',
            backgroundImage:
                'url(https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1500&q=80)',
        },
        labels: [
            { id: 'l101', title: 'Design', color: '#0079bf' },
            { id: 'l102', title: 'Backend', color: '#00c2e0' },
            { id: 'l103', title: 'Frontend', color: '#ff9f1a' },
            { id: 'l104', title: 'QA', color: '#eb5a46' },
            { id: 'l105', title: 'Research', color: '#c377e0' },
            { id: 'l106', title: 'Priority', color: '#61bd4f' },
        ],
        members: [
            { _id: 'u101', fullname: 'Eden Avgi', imgUrl: 'https://i.pravatar.cc/150?img=3' },
            { _id: 'u102', fullname: 'Dana Levi', imgUrl: 'https://i.pravatar.cc/150?img=5' },
            { _id: 'u103', fullname: 'Tom Cohen', imgUrl: 'https://i.pravatar.cc/150?img=7' },
            { _id: 'u104', fullname: 'Liran Tal', imgUrl: 'https://i.pravatar.cc/150?img=8' },
            { _id: 'u105', fullname: 'Shira Azulay', imgUrl: 'https://i.pravatar.cc/150?img=9' },
        ],

        lists: [
            {
                id: utilService.makeId(),
                title: 'Quick Tasks',
                style: { backgroundColor: '#bbc9ffff' },

                tasks: [
                    { id: utilService.makeId(), title: 'Reply to client email' },
                    { id: utilService.makeId(), title: 'Fix layout padding on board header', style: { backgroundColor: '#ffb74d' } },
                    { id: utilService.makeId(), title: 'Rename CSS variables for clarity' },
                    { id: utilService.makeId(), title: 'Review pull request #24', style: { backgroundColor: '#a29bfe' } },
                ],
            },

            {
                id: utilService.makeId(),
                title: 'Research & Planning',
                style: { backgroundColor: '#ffeaa7' },
                tasks: [
                    { id: utilService.makeId(), title: 'Define MVP goals and priorities' },
                    { id: utilService.makeId(), title: 'Research drag-and-drop libraries for React', style: { backgroundColor: '#fab1a0' } },
                    { id: utilService.makeId(), title: 'Benchmark Trello’s performance with large boards' },
                    { id: utilService.makeId(), title: 'Document data flow between components', style: { backgroundColor: '#55efc4' } },
                    { id: utilService.makeId(), title: 'Prepare architecture diagram for final presentation' },
                    { id: utilService.makeId(), title: 'List user pain points found in interviews' },
                ],
            },

            {
                id: utilService.makeId(),
                title: 'Design Phase',
                tasks: [
                    { id: utilService.makeId(), title: 'Set up design system in Figma', style: { backgroundColor: '#74b9ff' } },
                    { id: utilService.makeId(), title: 'Redesign login screen – compact layout' },
                    { id: utilService.makeId(), title: 'Design interactive hover state for task cards', style: { backgroundColor: '#25ed4dff' } },
                    { id: utilService.makeId(), title: 'Create reusable icon component' },
                    { id: utilService.makeId(), title: 'Define color tokens and spacing units', style: { backgroundColor: '#fdcb6e' } },
                    { id: utilService.makeId(), title: 'Test dark mode contrast on mobile' },
                    { id: utilService.makeId(), title: 'Export illustrations for landing page', style: { backgroundColor: '#fab1a0' } },
                    { id: utilService.makeId(), title: 'Prototype board scroll animation' },
                ],
            },

            {
                id: utilService.makeId(),
                title: 'Frontend Development',
                style: { backgroundColor: '#ff8a53ff' },

                tasks: [
                    { id: utilService.makeId(), title: 'Build <BoardDetails> layout and toolbar' },
                    { id: utilService.makeId(), title: 'Implement <TaskList> with task add and cancel behavior', style: { backgroundColor: '#ffeaa7' } },
                    { id: utilService.makeId(), title: 'Handle click outside to close add task form' },
                    { id: utilService.makeId(), title: 'Integrate utilService for id generation', style: { backgroundColor: '#fab1a0' } },
                    { id: utilService.makeId(), title: 'Add smooth transitions between board states' },
                    { id: utilService.makeId(), title: 'Implement keyboard shortcuts for adding lists' },
                    { id: utilService.makeId(), title: 'Create <TaskPreview> component with edit button' },
                    { id: utilService.makeId(), title: 'Refactor boardService for consistency' },
                    { id: utilService.makeId(), title: 'Optimize rerenders using React.memo', style: { backgroundColor: '#81ecec' } },
                    { id: utilService.makeId(), title: 'Fix scrollbar overflow in lists container' },
                ],
            },

            {
                id: utilService.makeId(),
                title: 'Backend & Storage',
                tasks: [
                    { id: utilService.makeId(), title: 'Implement boardService.query() with localStorage' },
                    { id: utilService.makeId(), title: 'Add createDemoBoard() on first app load', style: { backgroundColor: '#55efc4' } },
                    { id: utilService.makeId(), title: 'Ensure board.id persists after save' },
                    { id: utilService.makeId(), title: 'Set up Express server (future step)' },
                    { id: utilService.makeId(), title: 'Test async-storage post() and put() functions' },
                    { id: utilService.makeId(), title: 'Add filtering logic for board search' },
                    { id: utilService.makeId(), title: 'Handle board deletion properly', style: { backgroundColor: '#ff7675' } },
                ],
            },

            {
                id: utilService.makeId(),
                title: 'QA & Testing',
                style: { backgroundColor: '#cbb0e8ff' },
                tasks: [
                    { id: utilService.makeId(), title: 'Verify task addition and removal works', style: { backgroundColor: '#a3e635' } },
                    { id: utilService.makeId(), title: 'Test renaming lists and canceling empty titles' },
                    { id: utilService.makeId(), title: 'Check persistence after reload (localStorage)' },
                    { id: utilService.makeId(), title: 'Ensure board saves on every change' },
                    { id: utilService.makeId(), title: 'Validate hover effect on edit task button', style: { backgroundColor: '#74b9ff' } },
                    { id: utilService.makeId(), title: 'Run tests with multiple lists open simultaneously' },
                    { id: utilService.makeId(), title: 'Check performance with 100+ tasks' },
                ],
            },

            {
                id: utilService.makeId(),
                title: 'Deployment & Docs',
                tasks: [
                    { id: utilService.makeId(), title: 'Create GitHub repo and push project' },
                    { id: utilService.makeId(), title: 'Write detailed README with setup guide' },
                    { id: utilService.makeId(), title: 'Deploy on GitHub Pages', style: { backgroundColor: '#81ecec' } },
                    { id: utilService.makeId(), title: 'Test production build performance' },
                    { id: utilService.makeId(), title: 'Add preview screenshots and demo link' },
                    { id: utilService.makeId(), title: 'Plan backend integration phase' },
                ],
            },
        ],
    }
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