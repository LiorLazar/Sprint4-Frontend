import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { BoardList } from '../cmps/BoardList.jsx'
import { BoardSidebar } from '../cmps/BoardSidebar.jsx'
import { loadBoards } from '../store/actions/board.actions.js'

export function BoardIndex() {
    const boards = useSelector(storeState => storeState.boardModule.boards)

    useEffect(() => {
        loadBoards()
    }, [])

    // Filter boards by type for different sections
    const starredBoards = boards.filter(board => board.isStarred)
    const recentlyViewed = boards.filter(board => board.isRecentlyViewed)
    const workspaceBoards = boards.filter(board => !board.isStarred && !board.isRecentlyViewed)

    return (
        <section className="board-index full">
            <BoardSidebar />

            <section className="board-main">
                {starredBoards.length > 0 && (
                    <section className="board-section">
                        <h1>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                            </svg>
                            Starred boards
                        </h1>
                        <BoardList boards={starredBoards} isStarred={true} />
                    </section>
                )}

                {recentlyViewed.length > 0 && (
                    <section className="board-section">
                        <h1>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                            </svg>
                            Recently viewed
                        </h1>
                        <BoardList boards={recentlyViewed} isStarred={false} />
                    </section>
                )}

                <section className="board-section">
                    <h1>YOUR WORKSPACES</h1>
                    <div className="workspace-header">
                        <div className="workspace-info">
                            <div className="workspace-avatar">S</div>
                            <span>Sprint4</span>
                        </div>
                        <div className="workspace-actions">
                            <button className="workspace-btn">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z"/>
                                </svg>
                                Boards
                            </button>
                            <button className="workspace-btn">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zM4 18v-4h2v4h2v2H4c-1.1 0-2-.9-2-2zm0-10V4c0-1.1.9-2 2-2h4v2H6v4H4zm16 10v-4h2v4c0 1.1-.9 2-2 2h-4v-2h4zM12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5z"/>
                                </svg>
                                Members
                            </button>
                            <button className="workspace-btn">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62-0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/>
                                </svg>
                                Settings
                            </button>
                        </div>
                    </div>
                    <BoardList boards={workspaceBoards} isStarred={false} showCreateNew={true} />
                    
                    <button className="view-closed-boards">
                        View all closed boards
                    </button>
                </section>
            </section>
        </section>
    )
}