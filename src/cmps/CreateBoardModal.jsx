import { useState, useRef, useEffect } from 'react'
import { addBoard } from '../store/actions/board.actions.js'
import { boardService } from '../services/board'
import { icons } from './SvgIcons.jsx'

export function CreateBoardModal({ isOpen, onClose, triggerRef }) {
    const [title, setTitle] = useState('')
    const [selectedBackground, setSelectedBackground] = useState('#0079bf')
    const [showTitleError, setShowTitleError] = useState(false)
    const [positionClass, setPositionClass] = useState('position-right')
    const [modalPosition, setModalPosition] = useState({ left: 0, top: 0 })
    const [isPositioned, setIsPositioned] = useState(false)
    const modalRef = useRef(null)

    const backgrounds = [
        '#0079bf', '#d29034', '#519839', '#b04632',
        '#89609e', '#cd5a91', '#4bbf6b', '#00aecc'
    ]

    useEffect(() => {
        if (isOpen && triggerRef?.current) {
            updateModalPosition()
            setIsPositioned(true)

            const handleScroll = () => updateModalPosition()
            const handleClickOutside = (event) => {
                if (modalRef.current && !modalRef.current.contains(event.target) &&
                    triggerRef.current && !triggerRef.current.contains(event.target)) {
                    handleClose()
                }
            }

            window.addEventListener('scroll', handleScroll, { passive: true })
            window.addEventListener('resize', handleScroll, { passive: true })
            document.addEventListener('mousedown', handleClickOutside)

            return () => {
                window.removeEventListener('scroll', handleScroll)
                window.removeEventListener('resize', handleScroll)
                document.removeEventListener('mousedown', handleClickOutside)
            }
        } else {
            setIsPositioned(false)
        }
    }, [isOpen])

    function updateModalPosition() {
        if (!triggerRef?.current) return

        const triggerRect = triggerRef.current.getBoundingClientRect()
        const modalWidth = 288
        const modalHeight = 450
        const viewportWidth = window.innerWidth
        const viewportHeight = window.innerHeight
        const padding = 8

        let left = triggerRect.right + padding
        let top = triggerRect.top + 5  // Move modal 5px below trigger (25px lower than previous -20px)
        let cssClass = 'position-right'

        // Check if modal would overflow on the right
        if (left + modalWidth > viewportWidth - padding) {
            left = triggerRect.left - modalWidth - padding
            cssClass = 'position-left'

            // If it would overflow on the left too, center it
            if (left < padding) {
                left = Math.max(padding, (viewportWidth - modalWidth) / 2)
                top = Math.max(padding, (viewportHeight - modalHeight) / 2)
                cssClass = 'position-center'
            }
        }

        // Better vertical positioning logic
        if (cssClass !== 'position-center') {
            // If modal would go above viewport, position it at the top edge
            if (top < padding) {
                top = padding
            }
            // If modal would go below viewport, try to position it above the trigger button
            else if (top + modalHeight > viewportHeight - padding) {
                const spaceAbove = triggerRect.top - padding
                const spaceBelow = viewportHeight - triggerRect.bottom - padding

                if (spaceAbove >= modalHeight) {
                    // Enough space above, position above the trigger
                    top = triggerRect.top - modalHeight - padding
                } else if (spaceBelow >= modalHeight) {
                    // Enough space below, position below the trigger
                    top = triggerRect.bottom + padding
                } else {
                    // Not enough space above or below, center vertically
                    top = Math.max(padding, (viewportHeight - modalHeight) / 2)
                }
            }
        }

        // Ensure modal stays within viewport horizontally (final check)
        if (left < padding) left = padding
        if (left + modalWidth > viewportWidth - padding) {
            left = viewportWidth - modalWidth - padding
        }

        setModalPosition({ left, top })
        setPositionClass(cssClass)
    }

    async function handleCreateBoard(ev) {
        ev.preventDefault()

        if (!title.trim()) {
            setShowTitleError(true)
            return
        }

        try {
            let board = boardService.getEmptyBoard()
            board = { ...board, title: title.trim(), style: { backgroundColor: selectedBackground } }
            await addBoard(board)
            handleClose()
        } catch (err) {
            console.log('Failed to create board:', err)
        }
    }

    function handleClose() {
        onClose()
        setTitle('')
        setSelectedBackground('#0079bf')
        setShowTitleError(false)
        setIsPositioned(false)
    }

    if (!isOpen) return null

    return (
        <div
            ref={modalRef}
            className={`create-board-modal ${positionClass}`}
            style={{
                left: modalPosition.left,
                top: modalPosition.top,
                visibility: isPositioned ? 'visible' : 'hidden'
            }}
        >
            <div className="modal-header">
                <h3>Create board</h3>
                <button className="x-btn" onClick={handleClose}>
                    {icons.xButton}
                </button>
            </div>

            <form onSubmit={handleCreateBoard}>
                <div className="board-preview-section">
                    <div
                        className="board-preview-mock"
                        style={{ backgroundColor: selectedBackground }}
                    >
                        {icons.boardPreview}
                    </div>
                </div>

                <div className="background-section">
                    <h4>Background</h4>
                    <div className="background-grid">
                        {backgrounds.map((color, index) => (
                            <button
                                key={index}
                                type="button"
                                className={`background-option ${selectedBackground === color ? 'selected' : ''}`}
                                style={{ backgroundColor: color }}
                                onClick={() => setSelectedBackground(color)}
                            >
                                {selectedBackground === color && <span className="checkmark">✓</span>}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="form-section">
                    <label htmlFor="board-title">Board title <span className="required">*</span></label>
                    <input
                        id="board-title"
                        type="text"
                        value={title}
                        onChange={(e) => {
                            setTitle(e.target.value)
                            setShowTitleError(false)
                        }}
                        className={showTitleError ? 'error' : ''}
                        maxLength={512}
                    />
                    {showTitleError && (
                        <div className="error-message">👋 Board title is required</div>
                    )}
                </div>

                <button type="submit" className="create-btn" disabled={!title.trim()}>
                    Create
                </button>
            </form>
        </div>
    )
}