import { useEffect, useRef, useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { icons } from '../SvgIcons.jsx'
import { boardMembers, labelPalette } from '../../services/data.js'
import { utilService } from '../../services/util.service.js'

export function TaskDynamicModal({ type, task, board, anchor, onClose, onSave }) {
  const [localTask, setLocalTask] = useState(structuredClone(task))
  const [date, setDate] = useState(task?.dueDate ? new Date(task.dueDate) : new Date())
  const [reminder, setReminder] = useState(task?.dueReminder || '1d')
  const [checklistTitle, setChecklistTitle] = useState('Checklist')
  const [link, setLink] = useState('')
  const [previewUrl, setPreviewUrl] = useState(null)
  const [position, setPosition] = useState({ top: 100, left: 100 })
  const [editingLabel, setEditingLabel] = useState(null)
  const [labelTitle, setLabelTitle] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [isDueActive, setIsDueActive] = useState(!!task?.dueDate)
  const boxRef = useRef(null)

  useEffect(() => setLocalTask(structuredClone(task)), [task])

  useEffect(() => {
    if (!labelPalette || Object.keys(labelPalette).length === 0) {
      const savedPalette = localStorage.getItem('labelPalette')
      if (savedPalette) {
        try {
          const parsed = JSON.parse(savedPalette)
          setLabelPalette(parsed)
        } catch (e) {
          console.error('Failed to parse saved palette:', e)
          setLabelPalette(originalLabelPalette)
        }
      } else {
        setLabelPalette(originalLabelPalette)
      }
    }
  }, [labelPalette])

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
      if (e.key === 'Escape') {
        if (editingLabel) {
          setEditingLabel(null)
        } else {
          onClose()
        }
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [onClose, editingLabel])

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

  function openEditLabel(labelId, ev) {
    ev.stopPropagation()
    setEditingLabel(labelId)
    
    const boardLabel = board?.labels?.find(l => l.id === labelId)
    if (boardLabel) {
      setLabelTitle(boardLabel.title || '')
      setSelectedColor(boardLabel.color || '')
    } else {
      const labelData = labelPalette[labelId]
      if (labelData) {
        const name = typeof labelData === 'object' ? labelData.name : ''
        const color = typeof labelData === 'string' ? labelData : labelData.color
        setLabelTitle(name)
        setSelectedColor(color)
      } else {
        setLabelTitle('')
        const firstColor = Object.values(labelPalette)[0]
        const defaultColor = typeof firstColor === 'string' ? firstColor : firstColor.color
        setSelectedColor(defaultColor)
      }
    }
  }

  function saveEditLabel() {
    if (!editingLabel || !board) return
    
    const existingLabelIndex = board.labels?.findIndex(l => l.id === editingLabel)
    
    let updatedLabels
    if (existingLabelIndex >= 0) {
      updatedLabels = [...board.labels]
      updatedLabels[existingLabelIndex] = {
        ...updatedLabels[existingLabelIndex],
        title: labelTitle,
        color: selectedColor
      }
    } else {
      const newLabel = {
        id: editingLabel,
        title: labelTitle,
        color: selectedColor
      }
      updatedLabels = [...(board.labels || []), newLabel]
    }
    
    if (onSave) {
      onSave({ boardLabels: updatedLabels })
    }
    
    setEditingLabel(null)
    setLabelTitle('')
    setSelectedColor('')
  }

  function deleteLabelHandler() {
    if (!editingLabel || !board) return
    
    const updatedLabels = localTask.labels?.filter(id => id !== editingLabel) || []
    updateFields({ labels: updatedLabels })
    
    const updatedBoardLabels = board.labels?.filter(l => l.id !== editingLabel) || []
    
    if (onSave) {
      onSave({ boardLabels: updatedBoardLabels })
    }
    
    setEditingLabel(null)
    setLabelTitle('')
    setSelectedColor('')
  }

  function createNewLabel() {
    const newLabelId = utilService.makeId()
    const firstColor = Object.values(labelPalette)[0]
    const defaultColor = typeof firstColor === 'string' ? firstColor : firstColor.color
    
    setEditingLabel(newLabelId)
    setLabelTitle('')
    setSelectedColor(defaultColor)
  }

  function getLabelData(labelId) {
    const boardLabel = board?.labels?.find(l => l.id === labelId)
    if (boardLabel) {
      return { color: boardLabel.color || '#gray', name: boardLabel.title || '' }
    }
    
    const labelData = labelPalette[labelId]
    if (typeof labelData === 'string') {
      return { color: labelData, name: '' }
    }
    return labelData || { color: '#gray', name: '' }
  }

  function getBoardLabels() {
    if (!board?.labels || board.labels.length === 0) return []
    return board.labels.map(label => ({
      id: label.id,
      color: label.color,
      name: label.title || ''
    }))
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
    if (!isDueActive) {
      updateFields({ dueDate: null, dueReminder: null })
      onClose()
      return
    }
    updateFields({ dueDate: date.toISOString(), dueReminder: reminder })
    onClose()
  }

  function handleRemoveDates() {
    updateFields({ dueDate: null, dueReminder: null })
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
    const existing = Array.isArray(task.attachments) ? task.attachments : []
    const newAttachment = {
      id: utilService.makeId(),
      url: link.trim(),
      name: link.split('/').pop(),
      createdAt: Date.now(),
      isCover: existing.length === 0
    }
    updateFields({ attachments: [...existing, newAttachment] })
    onClose()
  }

  function handleFileUpload(ev) {
    const file = ev.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = e => {
      const existing = Array.isArray(task.attachments) ? task.attachments : []
      const newAttachment = {
        id: utilService.makeId(),
        url: e.target.result,
        name: file.name,
        createdAt: Date.now(),
        isCover: existing.length === 0
      }
      updateFields({ attachments: [...existing, newAttachment] })
      onClose()
    }
    reader.readAsDataURL(file)
  }

  function getHeaderText() {
    if (editingLabel) return 'Edit label'
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
    <div className="submodal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div ref={boxRef} className="smart-modal" style={{ position: 'fixed', ...position }}>
        <div className="smart-modal-header">
          <h2>{getHeaderText()}</h2>
          <button className="x-btn" onClick={onClose}>{icons.xButton}</button>
        </div>

        {/* ===== DATES ===== */}
        {(type === 'dates' || !type) && (
          <>
            <div className="smart-modal-body">
              <div className="calendar-inline">
         <DatePicker
  selected={date ? new Date(date) : new Date()}
  onChange={setDate}
  inline
  dateFormat="MM/dd/yyyy"
  calendarStartDay={0}
/>
              </div>

              <div className="dates-fields">
                <label>
                  <input
                    type="checkbox"
                    checked={isDueActive}
                    onChange={() => setIsDueActive(!isDueActive)}
                  />
                  Due date
                </label>
                <div className="row-2">
                  <input
                    type="text"
                    className="modal-input"
                    value={date.toLocaleDateString()}
                    readOnly
                  />
                  <input
                    type="text"
                    className="modal-input"
                    value={date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    readOnly
                  />
                </div>
              </div>
            </div>

            <div className="smart-modal-footer">
              <button className="secondary" onClick={handleRemoveDates}>Remove</button>
              <button className="primary" onClick={saveDates}>Save</button>
            </div>
          </>
        )}

{/* ===== LABELS ===== */}
{type === 'labels' && (
  <>
    {/* מצב רגיל – רשימת לייבלים */}
    {!editingLabel && (
      <div className="smart-modal-body">
        <input className="modal-input" placeholder="Search labels..." />
        <div className="labels-list">
          {getBoardLabels().map(label => {
            const isSelected = localTask.labels?.includes(label.id)
            return (
              <div
                key={label.id}
                className={`label-row ${isSelected ? 'selected' : ''}`}
                onClick={() => toggleLabel(label.id)}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  readOnly
                  className="label-checkbox"
                />
                <div
                  className="label-long"
                  style={{ backgroundColor: label.color }}
                >
                  {label.name && (
                    <span className="label-name">{label.name}</span>
                  )}
                </div>
                <button
                  className="label-edit"
                  onClick={ev => openEditLabel(label.id, ev)}
                >
                  {icons.editLabel}
                </button>
              </div>
            )
          })}
        </div>

        <button className="create-label-btn" onClick={createNewLabel}>
          Create a new label
        </button>
      </div>
    )}

    {editingLabel && (
      <div className="smart-modal-body">
        <label className="field-label">Title</label>
        <input
          className="modal-input"
          value={labelTitle}
          onChange={e => setLabelTitle(e.target.value)}
          placeholder=""
        />

        <label className="field-label">Select a color</label>
        <div className="color-grid">
          {Object.entries(labelPalette).map(([colorId, labelData]) => {
            const color =
              typeof labelData === 'string' ? labelData : labelData.color
            return (
              <div
                key={colorId}
                className={`color-option ${
                  color === selectedColor ? 'selected' : ''
                }`}
                style={{ backgroundColor: color }}
                onClick={() => setSelectedColor(color)}
              />
            )
          })}
        </div>

        <div className="label-footer">
          <button className="btn-delete-label" onClick={deleteLabelHandler}>
            Delete
          </button>
          <button className="btn-save-label" onClick={saveEditLabel}>
            Save
          </button>
        </div>
      </div>
    )}
  </>
)}


        {/* ===== MEMBERS ===== */}
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

        {/* ===== CHECKLIST ===== */}
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
            </div>
          </>
        )}

        {/* ===== ATTACHMENTS ===== */}
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
              <button className="secondary" onClick={onClose}>Cancel</button>
              <button className="primary" onClick={attachImage}>Insert</button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
