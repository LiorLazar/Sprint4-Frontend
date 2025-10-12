import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { icons } from "./SvgIcons.jsx";
import { updateBoard, updateRecentlyViewed } from "../store/actions/board.actions.js";

export function BoardPreview({ board }) {
    const navigate = useNavigate();
    const [displayStarred, setDisplayStarred] = useState(board.isStarred);

    // Sync local state with board prop changes
    useEffect(() => {
        setDisplayStarred(board.isStarred);
    }, [board.isStarred]);

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
        
        // Immediately update the visual state for user feedback
        setDisplayStarred(!displayStarred);
        
        try {
            const updatedBoard = { ...board, isStarred: !board.isStarred };
            await updateBoard(updatedBoard);
        } catch (err) {
            console.log('Failed to toggle star:', err);
            // Revert the visual state if the server update fails
            setDisplayStarred(board.isStarred);
        }
    }

    return (
        <div className="board-preview" onClick={onBoardClick}>
            <div className="board-preview-content" style={{ backgroundColor: board.style?.backgroundColor || '#6b778c' }}>
                <button className={`star-btn ${displayStarred ? 'starred' : ''}`} onClick={onStarClick}>
                    {displayStarred ? icons.starFilled : icons.star}
                </button>
                <p className="board-title">{board.title}</p>
            </div>
        </div>
    )
}