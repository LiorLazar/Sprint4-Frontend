import { useEffect, useRef, useState } from 'react'
import { icons } from '../SvgIcons.jsx'
import { boardMembers, labelPalette } from '../../services/data.js'
import { utilService } from '../../services/util.service.js'

export function TaskDynamicModal({ type, task, anchor, onClose, onSave }) {
  const [localTask, setLocalTask] = useState(structuredClone(task))
  const [date, setDate] = useState(task?.dueDate ? new Date(task.dueDate).toISOString().slice(0, 16) : '')
  const [reminder, setReminder] = useState(task?.dueReminder || '1d')
  const [checklistTitle, setChecklistTitle] = useState('Checklist')
  const [link, setLink] = useState('')
  const [previewUrl, setPreviewUrl] = useState(null)
  const [position, setPosition] = useState({ top: 100, left: 100 })
  const boxRef = useRef(null)

  useEffect(() => setLocalTask(structuredClone(task)), [task])

  useEffect(() => {
    if (!anchor) return
    const width = 360
    const gap = 8
    const tentativeLeft = Math.min(anchor.left, window.innerWidth - width - 8)
    const top = Math.min(anchor.bottom + gap, window.innerHeight - 20)
    setPosition({ top, left: tentativeLeft, width })
  }, [anchor, type])

  useEffect(() => {
    function handleEscape(e) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [onClose])

  // ====== UPDATE TASK FIELDS ======
  function updateFields(fields) {
    const updated = { ...localTask, ...fields }
    setLocalTask(updated)
    onSave(updated)
  }

  // ====== LABELS ======
  function toggleLabel(labelId) {
    const updatedLabels = localTask.labels?.includes(labelId)
      ? localTask.labels.filter(id => id !== labelId)
      : [...(localTask.labels || []), labelId]
    updateFields({ labels: updatedLabels })
  }

  // ====== MEMBERS ======
  function toggleMember(memberId) {
    const updatedMembers = localTask.members?.includes(memberId)
      ? localTask.members.filter(id => id !== memberId)
      : [...(localTask.members || []), memberId]
    updateFields({ members: updatedMembers })
  }

  // ====== DATES ======
  function saveDates() {
    if (!date) updateFields({ dueDate: null, dueReminder: null })
    else updateFields({ dueDate: new Date(date).toISOString(), dueReminder: reminder })
    onClose()
  }

  // ====== CHECKLIST ======
  function saveChecklist() {
    const newChecklist = {
      id: utilService.makeId(),
      title: checklistTitle || 'Checklist',
      items: [],
    }
    updateFields({ checklists: [...(localTask.checklists || []), newChecklist] })
    onClose()
  }

  // ====== ATTACHMENT ======
  function attachImage() {
    if (!link.trim()) return
    const newAttachment = {
      id: utilService.makeId(),
      url: link.trim(),
      createdAt: Date.now(),
    }
    updateFields({ attachment: newAttachment })
    onClose()
  }

  function handleFileUpload(ev) {
    const file = ev.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = e => {
      const attachment = {
        id:utilService.makeId(),
        url: e.target.result,
        name: file.name,
        createdAt: Date.now(),
      }
      setPreviewUrl(e.target.result)
      updateFields({ attachment })
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

  const selectedMembers = boardMembers.filter(m => localTask.members?.includes(m.id))
  const unselectedMembers = boardMembers.filter(m => !localTask.members?.includes(m.id))

  return (
    <div
      className="submodal-overlay"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div ref={boxRef} className="smart-modal" style={{ position: 'fixed', ...position }}>
        <div className="smart-modal-header">
          <h2>{getHeaderText()}</h2>
          <button className="close-btn" onClick={onClose}>{icons.xButton}</button>
        </div>

        {/* LABELS */}
        {type === 'labels' && (
          <div className="smart-modal-body">
            <input className="modal-input" placeholder="Search labels..." />
            <div className="labels-list">
              {Object.entries(labelPalette).map(([labelId, color]) => {
                const isSelected = localTask.labels?.includes(labelId)
                return (
                  <div
                    key={labelId}
                    className={`label-row ${isSelected ? 'selected' : ''}`}
                    onClick={() => toggleLabel(labelId)}
                  >
                    <input type="checkbox" checked={isSelected} readOnly className="label-checkbox" />
                    <div className="label-long" style={{ backgroundColor: color }}></div>
                    <button className="label-edit">{icons.editLabel}</button>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* MEMBERS */}
        {type === 'members' && (
          <div className="smart-modal-body">
            <input className="modal-input" placeholder="Search members" />
            {selectedMembers.length > 0 && (
              <>
                <div className="members-section-title">Card members</div>
                <div className="members-list-rows">
                  {selectedMembers.map(m => (
                    <button key={m.id} className="member-row selected" onClick={() => toggleMember(m.id)}>
                      <span className="avatar sm" style={{ backgroundColor: m.color }}>{m.initials}</span>
                      <span className="member-name">{m.name}</span>
                      <span className="remove-icon">{icons.xButton}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
            <div className="members-section-title">Board members</div>
            <div className="members-list-rows">
              {unselectedMembers.map(m => (
                <button key={m.id} className="member-row" onClick={() => toggleMember(m.id)}>
                  <span className="avatar sm" style={{ backgroundColor: m.color }}>{m.initials}</span>
                  <span className="member-name">{m.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* CHECKLIST */}
        {type === 'checklist' && (
          <>
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
          </>
        )}

        {/* ATTACHMENTS */}
        {type === 'attachments' && (
          <>
            <div className="smart-modal-body">
              <label>Attach a file from your computer</label>
              <div className="upload-container">
                <label htmlFor="file-upload" className="upload-btn">Choose a file</label>
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
              </div>
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
          </>
        )}

        {/* DATES */}
        {(type === 'dates' || !type) && (
          <>
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
          </>
        )}
      </div>
    </div>
  )
}
