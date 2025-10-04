export const boardService = {
    getById,
}

const demoBoard = {
    id: "b101",
    title: "Project Alpha",
    style: { bgColor: "#026AA7" },
    members: [
        { id: "u101", fullname: "Eden Avgi" },
        { id: "u102", fullname: "Liran Levi" },
    ],
    lists: [
        {
            id: "l101",
            title: "Backlog",
            tasks: [
                { id: "t101", title: "Setup repo" },
                { id: "t102", title: "Design schema" },
            ],
        },
        {
            id: "l102",
            title: "In Progress",
            tasks: [
                { id: "t103", title: "BoardDetails UI" },
            ],
        },
    ],
}

function getById(boardId) {
    return Promise.resolve(demoBoard) // ignore id for now
}
