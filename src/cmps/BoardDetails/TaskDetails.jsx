import { useState } from 'react'
import { icons } from '../SvgIcons'

export function TaskDetails({ task, isOpen, onClose, onSave, onDelete }) {
    const [title, setTitle] = useState(task?.title || '')
    const [description, setDescription] = useState(task?.description || '')

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
                {/* Header */}
                <div className="task-details-header">
                    <div className="task-header-left">
                        <div className="task-icon">{icons.checklistItem}</div>
                        <div className="task-title-section">
                            <input
                                type="text"
                                value={title}
                                onChange={(ev) => setTitle(ev.target.value)}
                                onBlur={handleSave}
                                className="task-title-input"
                                placeholder="Enter task title..."
                            />
                            <div className="task-location">
                                in list <span className="list-name">Board Backlog</span>
                            </div>
                        </div>
                    </div>
                    <button className="close-btn" onClick={onClose}>
                        {icons.xButton}
                    </button>
                </div>

                {/* Main Content */}
                <div className="task-details-content">
                    {/* Left Panel */}
                    <div className="task-details-left">
                        {/* Members Section */}
                        <div className="task-section">
                            <h3>Members</h3>
                            <div className="members-list">
                                <div className="member-avatar">GA</div>
                                <button className="add-member-btn">{icons.addCard}</button>
                            </div>
                        </div>

                        {/* Description Section */}
                        <div className="task-section">
                            <div className="section-header">
                                <div className="section-icon">{icons.cardDescriptions}</div>
                                <h3>Description</h3>
                            </div>
                            <textarea
                                value={description}
                                onChange={(ev) => setDescription(ev.target.value)}
                                onBlur={handleSave}
                                placeholder="Add a more detailed description..."
                                className="description-textarea"
                            />
                        </div>

                        {/* Comments and Activity */}
                        <div className="task-section">
                            <div className="section-header">
                                <h3>Comments and activity</h3>
                                <button className="show-details-btn">Show details</button>
                            </div>
                            <div className="comment-input-section">
                                <div className="comment-avatar">LL</div>
                                <input
                                    type="text"
                                    placeholder="Write a comment..."
                                    className="comment-input"
                                />
                            </div>
                            <div className="activity-item">
                                <div className="activity-avatar">LL</div>
                                <div className="activity-content">
                                    <span className="activity-user">lior lazar</span> added this card to Client Backlog
                                    <div className="activity-time">Sep 28, 2025, 7:00 PM</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel */}
                    <div className="task-details-right">
                        <div className="actions-section">
                            <h4>Add to card</h4>
                            <button className="action-btn">
                                <span className="action-icon">👤</span>
                                Members
                            </button>
                            <button className="action-btn">
                                <span className="action-icon">🏷️</span>
                                Labels
                            </button>
                            <button className="action-btn">
                                <span className="action-icon">📅</span>
                                Dates
                            </button>
                            <button className="action-btn">
                                <span className="action-icon">✅</span>
                                Checklist
                            </button>
                            <button className="action-btn">
                                <span className="action-icon">📎</span>
                                Attachment
                            </button>
                        </div>

                        <div className="actions-section">
                            <h4>Actions</h4>
                            <button className="action-btn" onClick={() => onDelete(task.id)}>
                                <span className="action-icon">🗑️</span>
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}