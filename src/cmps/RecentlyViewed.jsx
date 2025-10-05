import { BoardList } from './BoardList.jsx'

export function RecentlyViewed({ boards }) {
    // Filter boards that have been recently viewed and sort by most recent first
    const recentlyViewed = boards
        .filter(board => board.recentlyViewed) // Only boards that have been viewed
        .sort((a, b) => new Date(b.recentlyViewed) - new Date(a.recentlyViewed)) // Sort by most recent first
        .slice(0, 4) // Take only the first 4

    if (recentlyViewed.length === 0) {
        return null
    }

    return (
        <section className="board-section">
            <h1>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                Recently viewed
            </h1>
            <BoardList boards={recentlyViewed} />
        </section>
    )
}