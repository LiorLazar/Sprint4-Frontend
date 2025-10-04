import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { BoardSidebar } from '../cmps/BoardSidebar.jsx'
import { StarredBoards } from '../cmps/StarredBoards.jsx'
import { RecentlyViewed } from '../cmps/RecentlyViewed.jsx'
import { Workspace } from '../cmps/Workspace.jsx'
import { loadBoards } from '../store/actions/board.actions.js'

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