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

  if (!boards?.length) return <div className="loading">Loading boards...</div>

  return (
    <section className="board-index full">
      <BoardSidebar />

      <section className="board-main">
        <StarredBoards boards={boards.filter(b => b.isStarred)} />

        <RecentlyViewed
          boards={boards
            .filter(b => b.recentlyViewed)
            .sort(
              (a, b) =>
                new Date(b.recentlyViewed) - new Date(a.recentlyViewed)
            )}
        />

        <Workspace boards={boards} />
      </section>
    </section>
  )
}
