import { useNavigate } from "react-router-dom";
import { boardService } from "../services/board/board.service.local";

export function BoardPreview({ board }) {
    const navigate = useNavigate();

    function onBoardClick() {
        board.isLastViewed = true;
        boardService.save(board);

        navigate(`/board/${board._id}`);
    }

    return (
        <div className="board-preview" onClick={onBoardClick}>
            <div className="board-preview-content" style={{ backgroundColor: board.style?.backgroundColor || '#6b778c' }}>
                {board.isStarred && (
                    <button className="star-btn">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                        </svg>
                    </button>
                )}
                <p className="board-title">{board.title}</p>
            </div>
        </div>
    )
}