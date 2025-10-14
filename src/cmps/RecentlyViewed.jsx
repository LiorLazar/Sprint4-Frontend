import { BoardList } from './BoardList.jsx'
import { icons } from './SvgIcons.jsx'

export function RecentlyViewed({ boards }) {
    // Take only the first 4 (boards are already filtered and sorted by BoardIndex)
    const recentlyViewed = boards.slice(0, 4)

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