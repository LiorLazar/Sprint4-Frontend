import { Link } from 'react-router-dom'
import { icons } from "./SvgIcons"

export function BoardSidebar() {
    return (
        <section className="board-sidebar">
            {/* כפתור מעבר ללוחות */}
            <button className="btn-sidebar">
                <span>{icons.treloIcon}</span>
                Boards
            </button>

            {/* לינק לדף הבית */}
            <Link to="/" className="btn-sidebar">
                <span>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1">
                        <path d="M755.2 576L640 192H576L458.112 616.96 383.36 300.16h-62.08L246.4 576H64v63.36h206.72l31.36-23.68 47.36-172.8L421.76 768h65.92l119.68-450.56 93.44 299.52 30.72 23.04H960V576h-204.8z" fill="currentColor"/>
                    </svg>
                </span>
                Home
            </Link>

            <div className="workspace-section">
                {/* בעתיד ניתן להחזיר חלק זה */}
                {/* <h3>Workspaces</h3>
                <div className="workspace-item">
                    <div className="workspace-avatar">S</div>
                    <span>Sprint4</span>
                    <button className="workspace-toggle">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M7 10l5 5 5-5z"/>
                        </svg>
                    </button>
                </div> */}
            </div>
        </section>
    )
}
