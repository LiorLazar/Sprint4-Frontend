import { utilService } from './util.service.js'

export const boardMembers = [
    { id: 'ea', name: 'Eden Avgi', initials: 'EA', color: '#1f845a' },
    { id: 'ga', name: 'Golan Asraf', initials: 'GA', color: '#0c66e4' },
    { id: 'll', name: 'Lior Lazar', initials: 'LL', color: '#1d7afc' },
    { id: 'r', name: 'Reut Ery', initials: 'R', color: '#8270db' },
    { id: 'dm', name: 'Dana M.', initials: 'DM', color: '#c9372c' },
]

export const labelPalette = {
    // Row 1 - Light colors
    'green-light': { color: '#4bce97', name: '' },
    'yellow-light': { color: '#f5cd47', name: '' },
    'orange-light': { color: '#fea362', name: '' },
    'red-light': { color: '#f87168', name: '' },
    'purple-light': { color: '#9f8fef', name: '' },

    // Row 2 - Medium colors
    'green': { color: '#1f845a', name: '' },
    'yellow': { color: '#946f00', name: '' },
    'orange': { color: '#c25100', name: '' },
    'red': { color: '#ca3521', name: '' },
    'purple': { color: '#6e5dc6', name: '' },

    // Row 3 - Dark colors
    'green-dark': { color: '#164b35', name: '' },
    'yellow-dark': { color: '#7f5f01', name: '' },
    'orange-dark': { color: '#a54800', name: '' },
    'red-dark': { color: '#ae2a19', name: '' },
    'purple-dark': { color: '#5e4db2', name: '' },

    // Row 4 - Light pastels
    'blue-light': { color: '#579dff', name: '' },
    'sky-light': { color: '#6cc3e0', name: '' },
    'lime-light': { color: '#94c748', name: '' },
    'pink-light': { color: '#e774bb', name: '' },
    'gray-light': { color: '#8590a2', name: '' },

    // Row 5 - Medium blues and greens
    'blue': { color: '#0c66e4', name: '' },
    'sky': { color: '#227d9b', name: '' },
    'lime': { color: '#5b7f24', name: '' },
    'pink': { color: '#ae4787', name: '' },
    'gray': { color: '#626f86', name: '' },

    // Row 6 - Dark blues and greens
    'blue-dark': { color: '#09326c', name: '' },
    'sky-dark': { color: '#206a83', name: '' },
    'lime-dark': { color: '#4c6b1f', name: '' },
    'pink-dark': { color: '#943d73', name: '' },
    'gray-dark': { color: '#44546f', name: '' },
}

export const demoBoard = {
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
        { _id: 'u102', fullname: 'Golan Asraf', imgUrl: 'https://i.pravatar.cc/150?img=5' },
        { _id: 'u103', fullname: 'Lior Lazer', imgUrl: 'https://i.pravatar.cc/150?img=7' },
        { _id: 'u104', fullname: 'Liran Tal', imgUrl: 'https://i.pravatar.cc/150?img=8' },
        { _id: 'u105', fullname: 'Shira Azulay', imgUrl: 'https://i.pravatar.cc/150?img=9' },
    ],
    lists: [
        {
            id: utilService.makeId(),
            title: 'Quick Tasks',
            style: { backgroundColor: '#bbc9ff' },
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
                { id: utilService.makeId(), title: 'Design interactive hover state for task cards', style: { backgroundColor: '#25ed4d' } },
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
            style: { backgroundColor: '#ff8a53' },
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
            style: { backgroundColor: '#cbb0e8' },
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
