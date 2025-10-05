import { useNavigate } from "react-router-dom";
import { icons } from "./SvgIcons.jsx";
import { updateBoard, updateRecentlyViewed } from "../store/actions/board.actions.js";

export function BoardPreview({ board }) {
    const navigate = useNavigate();

    async function onBoardClick() {
        try {
            await updateRecentlyViewed(board._id);
            navigate(`/board/${board._id}`);
        } catch (err) {
            console.log('Failed to update recently viewed:', err);
            navigate(`/board/${board._id}`);
        }
    }

    async function onStarClick(ev) {
        ev.stopPropagation();
        try {
            const updatedBoard = { ...board, isStarred: !board.isStarred };
            await updateBoard(updatedBoard);
        } catch (err) {
            console.log('Failed to toggle star:', err);
        }
    }

    return (
        <div className="board-preview" onClick={onBoardClick}>
            <div className="board-preview-content" style={{ backgroundColor: board.style?.backgroundColor || '#6b778c' }}>
                <button className={`star-btn ${board.isStarred ? 'starred' : ''}`} onClick={onStarClick}>
                    {board.isStarred ? icons.starFilled : icons.star}
                </button>
                <p className="board-title">{board.title}</p>
            </div>
        </div>
    )
}