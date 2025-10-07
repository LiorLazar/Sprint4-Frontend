import { useState, useRef } from 'react'
import { BoardPreview } from './BoardPreview.jsx'
import { CreateBoardModal } from './CreateBoardModal.jsx'

export function BoardList({ boards, showCreateNew = false }) {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const createBtnRef = useRef(null)

    function handleCreateNewBoard() {
        setIsModalOpen(prevState => !prevState)
    }

    function handleCloseModal() {
        setIsModalOpen(false)
    }

    return (
        <>
            <div className="board-list">
                {boards.map(board => (
                    <BoardPreview 
                        key={board._id} 
                        board={board}
                    />
                ))}
                {showCreateNew && (
                    <div 
                        ref={createBtnRef}
                        className="board-preview create-new" 
                        onClick={handleCreateNewBoard}
                    >
                        <div className="board-preview-content create-new-content">
                            <span>Create new board</span>
                        </div>
                    </div>
                )}
            </div>
            
            <CreateBoardModal 
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                triggerRef={createBtnRef}
            />
        </>
    )
}