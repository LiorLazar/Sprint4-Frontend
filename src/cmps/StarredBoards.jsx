import { BoardList } from './BoardList.jsx'
import { icons } from './SvgIcons.jsx'

export function StarredBoards({ boards }) {
    const starredBoards = boards.filter(board => board.isStarred)

    if (starredBoards.length === 0) {
        return null
    }

    return (
        <section className="board-section">
            <h1>
                <span className='star-svg'>{icons.star2}</span>
                
                Starred boards
            </h1>
            <BoardList boards={starredBoards} />
        </section>
    )
}