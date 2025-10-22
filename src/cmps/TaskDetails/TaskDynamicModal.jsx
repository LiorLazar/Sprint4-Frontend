import { useEffect, useRef, useState } from 'react'
import { icons } from '../SvgIcons.jsx'
import { boardMembers, labelPalette } from '../../services/data.js'

export function TaskDynamicModal({ type, task, anchor, onClose, onSave }) {
  const [date, setDate] = useState(task?.dueDate ? new Date(task.dueDate).toISOString().slice(0, 16) : '')
  const [reminder, setReminder] = useState(task?.dueReminder || '1d')
  const [checklistTitle, setChecklistTitle] = useState('Checklist')
  const [copyFrom, setCopyFrom] = useState('(none)')
  const [link, setLink] = useState('')
  const [labels, setLabels] = useState(task?.labels || [])
  const [members, setMembers] = useState(task?.members || [])
  const [previewUrl, setPreviewUrl] = useState(null)

  const boxRef = useRef(null)
  const [position, setPosition] = useState({ top: 100, left: 100 })

  useEffect(() => {
    if (!anchor) return
    const width = 360
    const gap = 8
    const tentativeLeft = Math.min(anchor.left, window.innerWidth - width - 8)
    const top = Math.min(anchor.bottom + gap, window.innerHeight - 20)
    setPosition({ top, left: tentativeLeft, width })
  }, [anchor, type])

  useEffect(() => {
    function handleEscape(event) {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [onClose])

  function toggleLabel(labelId) {
    setLabels(prev => {
      const updated = prev.includes(labelId)
        ? prev.filter(id => id !== labelId)
        : [...prev, labelId]
      onSave({ labels: updated })
      return updated
    })
  }

  function toggleMember(memberId) {
    setMembers(prev => {
      const updated = prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
      onSave({ members: updated })
      return updated
    })
  }

  function saveDates() {
    if (!date) onSave({ dueDate: null, dueReminder: null })
    else onSave({ dueDate: new Date(date).toISOString(), dueReminder: reminder })
    onClose()
  }

  function saveChecklist() {
    const newChecklist = {
      id: crypto.randomUUID(),
      title: checklistTitle || 'Checklist',
      items: [],
      copiedFrom: copyFrom,
    }
    onSave({ checklists: [...(task.checklists || []), newChecklist] })
    onClose()
  }

  function attachImage() {
    if (!link.trim()) return
    const newAttachment = {
      id: crypto.randomUUID(),
      url: link.trim(),
      createdAt: Date.now(),
    }
    onSave({ attachment: newAttachment })
    onClose()
  }

  function handleFileUpload(ev) {
    const file = ev.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = e => {
      setPreviewUrl(e.target.result)
      onSave({
        attachment: {
          id: crypto.randomUUID(),
          url: e.target.result,
          name: file.name,
          createdAt: Date.now(),
        }
      })
      onClose()
    }
    reader.readAsDataURL(file)
  }

  function getHeaderText() {
    switch (type) {
      case 'labels': return 'Labels'
      case 'checklist': return 'Add checklist'
      case 'members': return 'Members'
      case 'attachments': return 'Add image'
      case 'dates': default: return 'Dates'
    }
  }

  const cardMembers = boardMembers.filter(m => members.includes(m.id))
  const otherMembers = boardMembers.filter(m => !members.includes(m.id))

  return (
    <div className="submodal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      {/* LABELS */}
      {type === 'labels' && (
        <div ref={boxRef} className="smart-modal" style={{ position: 'fixed', ...position }}>
          <div className="smart-modal-header">
            <h2>{getHeaderText()}</h2>
            <button className="close-btn" onClick={onClose}>{icons.xButton}</button>
          </div>
          <div className="smart-modal-body">
            <input className="modal-input" placeholder="Search labels..." />
            <div className="labels-list">
              {Object.entries(labelPalette).map(([labelId, color]) => {
                const isSelected = labels.includes(labelId)
                return (
                  <div
                    key={labelId}
                    className={`label-row ${isSelected ? 'selected' : ''}`}
                    onClick={() => toggleLabel(labelId)}
                  >
                    <input type="checkbox" checked={isSelected} readOnly className="label-checkbox" />
                    <div className="label-long" style={{ backgroundColor: color }}></div>
                    <button className="label-edit">{icons.editCard}</button>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* MEMBERS */}
      {type === 'members' && (
        <div ref={boxRef} className="smart-modal" style={{ position: 'fixed', ...position }}>
          <div className="smart-modal-header">
            <h2>{getHeaderText()}</h2>
            <button className="close-btn" onClick={onClose}>{icons.xButton}</button>
          </div>
          <div className="smart-modal-body">
            <input className="modal-input" placeholder="Search members" />
            {cardMembers.length > 0 && (
              <>
                <div className="members-section-title">Card members</div>
                <div className="members-list-rows">
                  {cardMembers.map(member => (
                    <button key={member.id} className="member-row selected" onClick={() => toggleMember(member.id)}>
                      <span className="avatar sm" style={{ backgroundColor: member.color }}>{member.initials}</span>
                      <span className="member-name">{member.name}</span>
                      <span className="remove-icon">{icons.xButton}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
            <div className="members-section-title">Board members</div>
            <div className="members-list-rows">
              {otherMembers.map(member => (
                <button key={member.id} className="member-row" onClick={() => toggleMember(member.id)}>
                  <span className="avatar sm" style={{ backgroundColor: member.color }}>{member.initials}</span>
                  <span className="member-name">{member.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CHECKLIST */}
      {type === 'checklist' && (
        <div ref={boxRef} className="smart-modal" style={{ position: 'fixed', ...position }}>
          <div className="smart-modal-header">
            <h2>{getHeaderText()}</h2>
            <button className="close-btn" onClick={onClose}>{icons.xButton}</button>
          </div>
          <div className="smart-modal-body">
            <label>Title</label>
            <input
              className="modal-input"
              value={checklistTitle}
              onChange={e => setChecklistTitle(e.target.value)}
            />
          </div>
          <div className="smart-modal-footer">
            <button className="primary" onClick={saveChecklist}>Add</button>
            <button className="secondary" onClick={onClose}>Cancel</button>
          </div>
        </div>
      )}

      {/* ATTACHMENTS */}
      {type === 'attachments' && (
        <div ref={boxRef} className="smart-modal" style={{ position: 'fixed', ...position }}>
          <div className="smart-modal-header">
            <h2>{getHeaderText()}</h2>
            <button className="close-btn" onClick={onClose}>{icons.xButton}</button>
          </div>
          <div className="smart-modal-body">
            <label>Search or paste a link</label>
            <input
              className="modal-input"
              placeholder="find recent links or paste a new link"
              value={link}
              onChange={e => setLink(e.target.value)}
            />
            <label>Attach a file from your computer</label>
            <input type="file" accept="image/*" onChange={handleFileUpload} />
            {previewUrl && (
              <div className="image-preview">
                <img src={previewUrl} alt="preview" />
              </div>
            )}
          </div>
          <div className="smart-modal-footer">
            <button className="primary" onClick={attachImage}>Attach</button>
            <button className="secondary" onClick={onClose}>Cancel</button>
          </div>
        </div>
      )}

      {/* DATES */}
      {(type === 'dates' || !type) && (
        <div ref={boxRef} className="smart-modal" style={{ position: 'fixed', ...position }}>
          <div className="smart-modal-header">
            <h2>{getHeaderText()}</h2>
            <button className="close-btn" onClick={onClose}>{icons.xButton}</button>
          </div>
          <div className="smart-modal-body">
            <label>Due date</label>
            <div className="row-2">
              <input
                type="date"
                className="modal-input"
                value={date ? date.slice(0, 10) : ''}
                onChange={e => {
                  const timePart = date?.slice(11) || '12:00'
                  setDate(`${e.target.value}T${timePart}`)
                }}
              />
              <input
                type="time"
                className="modal-input"
                value={date ? date.slice(11) : ''}
                onChange={e => {
                  const datePart = date ? date.slice(0, 10) : new Date().toISOString().slice(0, 10)
                  setDate(`${datePart}T${e.target.value}`)
                }}
              />
            </div>
          </div>
          <div className="smart-modal-footer">
            <button className="primary" onClick={saveDates}>Save</button>
            <button className="secondary" onClick={onClose}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  )
}
