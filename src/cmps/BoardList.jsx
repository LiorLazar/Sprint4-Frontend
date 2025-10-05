import { BoardPreview } from './BoardPreview.jsx'
import { createRandomBoard } from '../store/actions/board.actions.js'

export function BoardList({ boards, showCreateNew = false }) {
    async function onCreateNewBoard() {
        try {
            await createRandomBoard()
        } catch (err) {
            console.log('Failed to create random board:', err)
        }
    }

    return (
        <div className="board-list">
            {boards.map(board => (
                <BoardPreview 
                    key={board._id} 
                    board={board}
                />
            ))}
            {showCreateNew && (
                <div className="board-preview create-new" onClick={onCreateNewBoard}>
                    <div className="board-preview-content create-new-content">
                        <span>Create new board</span>
                    </div>
                </div>
            )}
        </div>
    )
}