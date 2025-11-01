import { useEffect, useRef, useState } from 'react'
import { icons } from '../SvgIcons.jsx'

export function TaskActionsMenu({ anchor, onClose, onAction, onDeleteTask }) {
  const menuRef = useRef(null)
  const [position, setPosition] = useState({ top: 0, left: 0 })

  // ===== Close menu when clicking outside =====
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) onClose()
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])

  // ===== Calculate dynamic position =====
  useEffect(() => {
    if (!anchor) return
    const menuWidth = 220
    const menuHeight = 320
    const padding = 8

    let left = anchor.left
    let top = anchor.bottom + 8

    if (left + menuWidth > window.innerWidth - padding) {
      left = window.innerWidth - menuWidth - padding
    }
    if (top + menuHeight > window.innerHeight - padding) {
      top = anchor.top - menuHeight - padding
    }

    setPosition({ top, left })
  }, [anchor])

  const actions = [
    { label: 'Open card', type: 'open', icon: icons.card },
    { label: 'Edit labels', type: 'labels', icon: icons.tag },
    { label: 'Change members', type: 'members', icon: icons.members },
    { label: 'Change cover', type: 'cover', icon: icons.image },
    { label: 'Edit dates', type: 'dates', icon: icons.clock },
    { label: 'Archive', type: 'archive', icon: icons.archive },
  ]

  return (
    <div className="task-menu-overlay" onClick={onClose}>
      <div
        ref={menuRef}
        className="task-actions-menu"
        style={{ top: position.top, left: position.left }}
        onClick={ev => ev.stopPropagation()}
      >
        <div className="menu-body">
          {actions.map(action => (
            <button
              key={action.type}
              className="action-btn"
              onClick={ev => {
                ev.stopPropagation()
                if (action.type === 'archive') {
                  onDeleteTask?.() // ✅ מוחק מהלוקאלי ומהשרת דרך BoardDetails
                  onClose()
                  return
                }
                onAction(action.type, ev)
              }}
            >
              <span className="icon">{action.icon}</span>
              <span>{action.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
