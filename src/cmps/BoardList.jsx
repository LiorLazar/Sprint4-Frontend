import { BoardPreview } from './BoardPreview.jsx'

export function BoardList({ boards, isStarred = false, showCreateNew = false }) {
    return (
        <div className="board-list">
            {boards.map(board => (
                <BoardPreview 
                    key={board.id} 
                    board={board} 
                    isStarred={isStarred}
                />
            ))}
            {showCreateNew && (
                <div className="board-preview create-new">
                    <div className="board-preview-content create-new-content">
                        <span>Create new board</span>
                    </div>
                </div>
            )}
        </div>
    )
}