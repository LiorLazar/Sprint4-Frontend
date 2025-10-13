import { useState, useEffect } from 'react'
import { icons } from '../SvgIcons'

export function TaskDetails({ task, isOpen, onClose, onSave, onDelete }) {
    const [title, setTitle] = useState(task?.title || '')
    const [description, setDescription] = useState(task?.description || '')

    // Prevent background interaction when modal is open
    useEffect(() => {
        if (isOpen) {
            // Add class to body to prevent scrolling and interaction
            document.body.style.overflow = 'hidden'
            document.body.classList.add('modal-open')
            
            // Add keyboard event listener for Escape key
            const handleEscapeKey = (e) => {
                if (e.key === 'Escape') {
                    onClose()
                }
            }
            
            document.addEventListener('keydown', handleEscapeKey)
            
            return () => {
                // Cleanup when modal closes
                document.body.style.overflow = ''
                document.body.classList.remove('modal-open')
                document.removeEventListener('keydown', handleEscapeKey)
            }
        }
    }, [isOpen, onClose])

    if (!isOpen || !task) return null

    function handleSave() {
        const updatedTask = {
            ...task,
            title: title.trim(),
            description: description.trim()
        }
        onSave(updatedTask)
    }

    function handleOverlayClick(ev) {
        if (ev.target === ev.currentTarget) {
            onClose()
        }
    }

    return (
        <div className="task-details-overlay" onClick={handleOverlayClick}>
            <div className="task-details-modal">
                <button className="close-btn" onClick={onClose}>
                    {icons.xButton}
                </button>
                
                {/* Grid Layout Container */}
                <div className="task-details-grid">
                    {/* Row 1 - Full Width: Client Backlog */}
                    <div className="grid-header">
                        <div className="task-location">
                            in list <span className="list-name">Client Backlog</span>
                        </div>
                    </div>

                    {/* Row 2, Column 1: Main Content */}
                    <div className="grid-main">
                        {/* Task Title */}
                        <div className="task-title-section">
                            <div className="task-icon">{icons.checklistItem}</div>
                            <input
                                type="text"
                                value={title}
                                onChange={(ev) => setTitle(ev.target.value)}
                                onBlur={handleSave}
                                className="task-title-input"
                                placeholder="Enter task title..."
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="action-buttons-row">
                            <button className="action-button">
                                <span className="action-button-icon">+</span>
                                Add
                            </button>
                            <button className="action-button">
                                <span className="action-button-icon">🏷️</span>
                                Labels
                            </button>
                            <button className="action-button">
                                <span className="action-button-icon">📅</span>
                                Dates
                            </button>
                            <button className="action-button">
                                <span className="action-button-icon">✅</span>
                                Checklist
                            </button>
                            <button className="action-button">
                                <span className="action-button-icon">📎</span>
                                Attachment
                            </button>
                        </div>

                        {/* Members Section */}
                        <div className="task-section members-section">
                            <h3 className="section-title">Members</h3>
                            <div className="members-list">
                                <div className="member-avatar">LL</div>
                                <button className="add-member-btn">+</button>
                            </div>
                        </div>

                        {/* Description Section */}
                        <div className="task-section description-section">
                            <div className="section-header">
                                <div className="section-icon">{icons.cardDescriptions}</div>
                                <h3 className="section-title">Description</h3>
                            </div>
                            <textarea
                                value={description}
                                onChange={(ev) => setDescription(ev.target.value)}
                                onBlur={handleSave}
                                placeholder="Add a more detailed description..."
                                className="description-textarea"
                            />
                        </div>
                    </div>

                    {/* Row 2, Column 2: Comments and Activity */}
                    <div className="grid-sidebar">
                        <div className="comments-section">
                            <div className="section-header">
                                <h3 className="section-title">Comments and activity</h3>
                                <button className="show-details-btn">Show details</button>
                            </div>
                            <div className="comment-input-section">
                                <input
                                    type="text"
                                    placeholder="Write a comment..."
                                    className="comment-input"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}