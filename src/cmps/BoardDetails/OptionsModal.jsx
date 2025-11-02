import { useRef, useEffect } from 'react'
import { icons } from '../SvgIcons'

export function OptionsModal({ board, onClose, onToggleStar, onChangeColor, onChangeBackgroundImage }) {
    const modalRef = useRef(null)

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose()
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [onClose])

    const colors = [
        { name: 'blue', class: 'color-blue', hex: '#0079bf' },
        { name: 'orange', class: 'color-orange', hex: '#d29034' },
        { name: 'green', class: 'color-green', hex: '#519839' },
        { name: 'red', class: 'color-red', hex: '#b04632' },
        { name: 'purple', class: 'color-purple', hex: '#89609e' },
        { name: 'pink', class: 'color-pink', hex: '#cd5a91' },
        { name: 'lime', class: 'color-lime', hex: '#4bbf6b' },
        { name: 'sky', class: 'color-sky', hex: '#00aecc' }
    ]

    const handleColorChange = (colorHex) => {
        onChangeColor(colorHex)
    }

    const handleStarToggle = () => {
        onToggleStar()
    }

    // ====== IMAGE UPLOAD ======
    const handleImageUpload = (ev) => {
        const file = ev.target.files[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = (event) => {
            const imageUrl = event.target.result
            onChangeBackgroundImage(imageUrl)
        }
        reader.readAsDataURL(file)
    }

    return (
        <div ref={modalRef} className="options-modal">
            <div className="options-modal-header">
                <h3 className="options-modal-title">Menu</h3>
                <button className="options-close-btn" onClick={onClose}>
                    {icons.xButton}
                </button>
            </div>

            <div className="options-modal-content">
                <div className="option-item" onClick={handleStarToggle}>
                    <span>{board?.isStarred ? 'Unstar board' : 'Star board'}</span>
                    <div className="star-toggle">
                        {board?.isStarred ? icons.starFilled : icons.star}
                    </div>
                </div>

                <div className="option-item">
                    <span>Labels</span>
                </div>

                <hr className="divider" />

                {/* ===== BACKGROUND COLORS ===== */}
                <div className="color-section">
                    <h4 className="color-section-title">CHANGE BACKGROUND</h4>
                    <div className="color-grid">
                        {colors.map((color) => (
                            <div
                                key={color.name}
                                className={`color-option ${color.class} ${board?.style?.backgroundColor === color.hex ? 'selected' : ''}`}
                                onClick={() => handleColorChange(color.hex)}
                            >
                                {board?.style?.backgroundColor === color.hex && (
                                    <span className="color-checkmark">✓</span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* ===== IMAGE UPLOAD ===== */}
                <div className="image-upload-section">
                    <h4 className="color-section-title">UPLOAD IMAGE</h4>
                    <label className="upload-btn">
                        {icons.image} Choose Image
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            style={{ display: 'none' }}
                        />
                    </label>
                    {board?.style?.backgroundImage && (
                        <div className="current-bg-preview">
                            <img src={board.style.backgroundImage} alt="Background preview" />
                            <button
                                className="remove-btn"
                                onClick={() => onChangeBackgroundImage(null)}
                            >
                                Remove
                            </button>
                        </div>
                    )}
                </div>

                <hr className="divider" />

                <div className="option-item">
                    <span>Archive this board</span>
                </div>
            </div>
        </div>
    )
}
