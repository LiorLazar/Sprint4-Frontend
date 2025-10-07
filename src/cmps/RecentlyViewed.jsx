import { BoardList } from './BoardList.jsx'
import { icons } from './SvgIcons.jsx'

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
                <span className='clock-svg'>{icons.clock}</span>
                Recently viewed
            </h1>
            <BoardList boards={recentlyViewed} />
        </section>
    )
}