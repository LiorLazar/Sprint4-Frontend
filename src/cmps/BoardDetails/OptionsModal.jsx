import { icons } from '../SvgIcons'
import { useEffect, useRef } from 'react'

export function OptionsModal({ board, onClose, onToggleStar, onChangeColor }) {
    const modalRef = useRef(null)

    const colors = [
        { name: 'blue', class: 'color-blue', hex: '#0079bf' },
        { name: 'orange', class: 'color-orange', hex: '#d29034' },
        { name: 'green', class: 'color-green', hex: '#519839' },
        { name: 'red', class: 'color-red', hex: '#b04632' },
        { name: 'purple', class: 'color-purple', hex: '#89609e' },
        { name: 'pink', class: 'color-pink', hex: '#cd5a91' },
        { name: 'lime', class: 'color-lime', hex: '#4bbf6b' },
        { name: 'sky', class: 'color-sky', hex: '#00aecc' }
    ];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                // Check if the click was on the options button - if so, don't close
                const optionsButton = document.querySelector('.btn-options');
                if (optionsButton && (optionsButton.contains(event.target) || optionsButton === event.target)) {
                    return;
                }
                onClose()
            }
        }
        
        document.addEventListener('mousedown', handleClickOutside)
        
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [onClose])

    const handleColorChange = (colorHex) => {
        onChangeColor(colorHex);
    };

    const handleStarToggle = () => {
        onToggleStar();
    };

    return (
        <div ref={modalRef} className="options-modal">
            <div className="options-modal-header">
                <h3 className="options-modal-title">Menu</h3>
                <button className="options-close-btn" onClick={onClose}>
                    {icons.close}
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
                <hr className="divider" />
                <div className="option-item">
                    <span>Archive this board</span>
                </div>
            </div>
        </div>
    )
}