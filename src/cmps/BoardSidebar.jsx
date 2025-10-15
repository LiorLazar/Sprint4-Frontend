import { icons } from "./SvgIcons"

export function BoardSidebar() {
    return (
        <section className="board-sidebar">
            <button className="btn-sidebar">
                <span>{icons.treloIcon}</span>
                Boards
            </button>
            <button className="btn-sidebar">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="m12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                Home
            </button>
            
            <div className="workspace-section">
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