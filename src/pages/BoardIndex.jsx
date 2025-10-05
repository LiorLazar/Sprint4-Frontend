import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { BoardSidebar } from '../cmps/BoardSidebar.jsx'
import { StarredBoards } from '../cmps/StarredBoards.jsx'
import { RecentlyViewed } from '../cmps/RecentlyViewed.jsx'
import { Workspace } from '../cmps/Workspace.jsx'
import { loadBoards } from '../store/actions/board.actions.js'

import { loadBoards, addBoard, updateBoard, removeBoard, addBoardMsg } from '../store/actions/board.actions'

import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'
import { boardService } from '../services/board/board.service'
import { userService } from '../services/user'

import { TaskList } from '../cmps/BoardDetails/TaskList'
import { BoardFilter } from '../cmps/BoardFilter'

export function BoardIndex() {
    const boards = useSelector(storeState => storeState.boardModule.boards)

    useEffect(() => {
        loadBoards()
    }, [])

    console.log('Boards:', boards);
    

    return (
        <section className="board-index full">
            <BoardSidebar />

            <section className="board-main">
                <StarredBoards boards={boards} />
                <RecentlyViewed boards={boards} />
                <Workspace boards={boards} />
            </section>
        </section>
    )
}