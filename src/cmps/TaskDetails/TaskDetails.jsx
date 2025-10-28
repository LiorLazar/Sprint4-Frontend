import { useState, useEffect } from 'react'
import { icons } from '../SvgIcons.jsx'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { TaskDynamicModal } from './TaskDynamicModal.jsx'
import { boardMembers, labelPalette } from '../../services/data.js'
import './TaskModals.css'

export function TaskDetails({ task, board, isOpen, onClose, onSave, listTitle }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
    const [isEditingDescription, setIsEditingDescription] = useState(false)
  const [editedDescription, setEditedDescription] = useState('')
  const [dueDate, setDueDate] = useState(null)
  const [labels, setLabels] = useState([])
  const [members, setMembers] = useState([])
  const [activeModal, setActiveModal] = useState(null)
  const [activeEditor, setActiveEditor] = useState(null)
  const [newItemText, setNewItemText] = useState({})

  useEffect(() => {
    if (isOpen && task) {
      setTitle(task.title || '')
      setDescription(task.description || '')
      setEditedDescription(task.description || '')
      setDueDate(task.dueDate || null)
      setLabels(task.labels || [])
      setMembers(task.members || [])
      document.body.classList.add('modal-open')
    }
    return () => document.body.classList.remove('modal-open')
  }, [isOpen, task])

  if (!isOpen || !task) return null

  function getLabelData(labelId) {
    const boardLabel = board?.labels?.find(l => l.id === labelId)
    if (boardLabel) {
      return { color: boardLabel.color, name: boardLabel.title || '' }
    }
    
    const labelData = labelPalette[labelId]
    if (typeof labelData === 'string') {
      return { color: labelData, name: '' }
    }
    return { color: labelData?.color || '#gray', name: labelData?.name || '' }
  }

    function saveDescription() {
    setDescription(editedDescription)
    handleSave({ description: editedDescription })
    setIsEditingDescription(false)
  }

  function cancelDescriptionEdit() {
    setEditedDescription(description)
    setIsEditingDescription(false)
  }

  function handleSave(updated = {}) {
    if (updated.boardLabels) {
      const updatedBoard = { ...board, labels: updated.boardLabels }
      if (onSave) {
        onSave({ ...task }, updatedBoard)
      }
      return
    }
    
    const updatedTask = {
      ...task,
      title: title.trim(),
      description: description,
      dueDate,
      labels,
      members,
      ...updated,
    }
    onSave(updatedTask)
  }

  function getFormattedDate(dateValue) {
    if (!dateValue) return null
    const d = new Date(dateValue)
    if (isNaN(d)) return null
    return d.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  function getDueClass(dateValue) {
    if (!dateValue) return ''
    const d = new Date(dateValue)
    const now = new Date()
    if (d < now) return 'overdue'
    const diffDays = (d - now) / (1000 * 60 * 60 * 24)
    if (diffDays < 1) return 'due-soon'
    return 'upcoming'
  }

  const formattedDate = getFormattedDate(dueDate)
  const selectedMemberObjects = boardMembers.filter(m => members?.includes(m.id))
  const attachments = task.attachments || []

  // ===== ATTACHMENTS =====
  function removeAttachment(id) {
    const updated = attachments.filter(a => a.id !== id)
    handleSave({ attachments: updated })
  }

  function setCover(id) {
    const updated = attachments.map(a => ({
      ...a,
      isCover: a.id === id,
    }))
    handleSave({ attachments: updated })
  }

  function formatAttachmentDate(ts) {
    return new Date(ts).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // ===== CHECKLIST LOGIC =====
  function getChecklistProgress(list) {
    if (!list.items?.length) return 0
    const done = list.items.filter(i => i.done).length
    return Math.round((done / list.items.length) * 100)
  }

  function toggleChecklistItem(checklistId, itemId) {
    const updated = task.checklists.map(list =>
      list.id === checklistId
        ? {
          ...list,
          items: list.items.map(i =>
            i.id === itemId ? { ...i, done: !i.done } : i
          ),
        }
        : list
    )
    handleSave({ checklists: updated })
  }

  function addChecklistItem(checklistId, text) {
    const txt = text?.trim()
    if (!txt) return
    const updated = task.checklists.map(list =>
      list.id === checklistId
        ? {
          ...list,
          items: [...list.items, { id: crypto.randomUUID(), text: txt, done: false }],
        }
        : list
    )
    handleSave({ checklists: updated })
    setNewItemText(prev => ({ ...prev, [checklistId]: '' }))
    setActiveEditor(null)
  }

  function saveEditedItem(checklistId, itemId, newText) {
    const txt = newText?.trim()
    if (!txt) return setActiveEditor(null)
    const updated = task.checklists.map(list =>
      list.id === checklistId
        ? {
          ...list,
          items: list.items.map(i =>
            i.id === itemId ? { ...i, text: txt } : i
          ),
        }
        : list
    )
    handleSave({ checklists: updated })
    setActiveEditor(null)
  }

  function removeChecklistItem(checklistId, itemId) {
    const updated = task.checklists.map(list =>
      list.id === checklistId
        ? { ...list, items: list.items.filter(i => i.id !== itemId) }
        : list
    )
    handleSave({ checklists: updated })
  }

  function onDeleteChecklist(checklistId) {
    handleSave({
      checklists: task.checklists.filter(c => c.id !== checklistId),
    })
  }

  // ===== RENDER =====
  return (
    <div
      className="task-details-overlay"
      onClick={ev => ev.target === ev.currentTarget && onClose()}
    >
      <div className="task-details-modal">
        <button className="close-btn" onClick={onClose}>
          {icons.xButton}
        </button>

        {/* COVER IMAGE */}
        {attachments.some(a => a.isCover) && (
          <div className="task-cover">
            <img
              src={attachments.find(a => a.isCover).url}
              alt="Cover"
              className="task-cover-image"
            />
          </div>
        )}

        <div className="task-details-grid">
          <div className="grid-header">
            <div className="task-location">
              in list <span className="list-name">{listTitle}</span>
            </div>
          </div>

          <div className="grid-main">
            {/* ===== TITLE ===== */}
            <div className="task-title-section">
              <div className="task-icon">{icons.circle}</div>
              <input
                className="task-title-input"
                value={title}
                onChange={e => setTitle(e.target.value)}
                onBlur={() => handleSave()}
                placeholder="Enter task title..."
              />
            </div>

            {/* ===== ACTION BUTTONS ===== */}
            <div className="action-buttons-row">
              {!task.checklists?.length && (
                <button className="action-button" onClick={() => setActiveModal('checklist')}>
                  <span className="action-button-icon">{icons.checklistItem}</span> Checklist
                </button>
              )}
              <button className="action-button" onClick={() => setActiveModal('attachments')}>
                <span className="action-button-icon">{icons.attachment}</span> Attachment
              </button>
              {!labels?.length && (
                <button className="action-button" onClick={() => setActiveModal('labels')}>
                  <span className="action-button-icon">{icons.labels}</span> Labels
                </button>
              )}
              {!dueDate && (
                <button className="action-button" onClick={() => setActiveModal('dates')}>
                  <span className="action-button-icon">{icons.clock}</span> Dates
                </button>
              )}
              {!members?.length && (
                <button className="action-button" onClick={() => setActiveModal('members')}>
                  <span className="action-button-icon">{icons.members}</span> Members
                </button>
              )}
            </div>

            <div className="meta-row">
              {/* MEMBERS */}
              {members.length > 0 &&
                (<div className="members-inline">
                  <div className="section-header tight">
                    <h3 className="section-title">Members</h3>
                  </div>
                  <div className="members-inline-list">
                    {selectedMemberObjects.map(member => (<span key={member.id}
                      className="avatar sm" style={{ backgroundColor: member.color }}>
                      {member.initials} </span>))}
                    <button className="add-member-inline"
                      onClick={() => setActiveModal('members')}> {icons.plus}
                    </button>
                  </div>
                </div>)}

              {/* ===== LABELS ===== */}
              {labels?.length > 0 && (

                <div className="labels-inline">
                  <div className="section-header tight">
                    <h3 className="section-title">Labels</h3>
                  </div>
                  <div className="labels-inline-list">
                    {labels.map(labelId => {
                      const { color, name } = getLabelData(labelId)

                      return (
                        <span
                          key={labelId}
                          className="label-chip-fat"
                          style={{ backgroundColor: color }}
                          title={name}
                        >
                          {name}
                        </span>
                      )
                    })}
                    <button className="add-label-inline" onClick={() => setActiveModal('labels')}>
                      {icons.plus}
                    </button>
                  </div>
                </div>
              )}

              {/* ===== DUE DATE ===== */}
              {dueDate && (
                <div className="dates-inline">
                  <div className="section-header tight">
                    <h3 className="section-title">Due date</h3>
                  </div>
                  <div className="due-inline-controls">
                    <button className="due-pill" onClick={() => setActiveModal('dates')}>
                      {formattedDate}
                      <span className={`due-badge ${getDueClass(dueDate)}`}>
                        {getDueClass(dueDate)}
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* ===== ATTACHMENTS ===== */}
            {attachments.length > 0 && (
              <div className="attachments-section">
                <div className="details-title">
                  {icons.attachment}
                  <h3 className="details-title">Attachments</h3>
                  <button className="add-btn" onClick={() => setActiveModal('attachments')}>
                    Add
                  </button>
                </div>

                <div className="attachments-list">
                  {attachments.map(att => (
                    <div key={att.id} className="attachment-row">
                      <img src={att.url} alt={att.name} className="attachment-thumb" />
                      <div className="attachment-info">
                        <div className="file-name">{att.name || 'Unnamed file'}</div>
                        <div className="file-meta">
                          Added {formatAttachmentDate(att.createdAt)}
                          {att.isCover && (
                            <span className="file-meta-cover">
                              • {icons.image} Cover
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="attachment-actions">
                        <button
                          className="btn-save"
                          onClick={() => setCover(att.id)}
                          title="Set as cover"
                        >
                          {icons.image} Cover
                        </button>

                        <button
                          className="btn-save"
                          onClick={() => removeAttachment(att.id)}
                          title="Delete attachment"
                        >
                          {icons.trash} Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

{/* ===== DESCRIPTION ===== */}
<div className="task-section description-section">
  <div className="details-title">
    <div className="details-title-left">
      {icons.cardDescriptions}
      <h3 className="details-title">Description</h3>
    </div>

    {!isEditingDescription && (
      <button
        className="delete-btn"
        onClick={() => setIsEditingDescription(true)}
      >
        Edit
      </button>
    )}
  </div>

  {!isEditingDescription ? (
    <div
      className={`description-display ${!description ? 'empty' : ''}`}
      onClick={() => setIsEditingDescription(true)}
    >
      {description ? (
        <div
          className="description-content"
          dangerouslySetInnerHTML={{ __html: description }}
        />
      ) : (
        <span className="placeholder-text">
          Add a more detailed description...
        </span>
      )}
    </div>
  ) : (
    <div className="description-editor-wrapper">
      <ReactQuill
        className="description-editor"
        theme="snow"
        value={editedDescription}
        onChange={setEditedDescription}
        placeholder="Add a more detailed description..."
      />
      <div className="description-actions">
        <button className="btn-save" onClick={saveDescription}>
          Save
        </button>
        <button className="btn-cancel" onClick={cancelDescriptionEdit}>
          Cancel
        </button>
      </div>
    </div>
  )}
</div>

            {/* ===== CHECKLISTS ===== */}
            {task.checklists?.map(checklist => {
              const isAdding = activeEditor?.type === 'add' && activeEditor.id === checklist.id
              const progress = getChecklistProgress(checklist)

              return (
                <div key={checklist.id} className="checklist-section">
                  <div className="checklist-header">
                    <div className="details-title">
                      {icons.checklistItem}
                      <h3 className="details-title">{checklist.title}</h3>
                    </div>
                    <button className="delete-btn" onClick={() => onDeleteChecklist(checklist.id)}>
                      Delete
                    </button>
                  </div>

                  <div className="progress-wrapper">
                    <div className="progress-percent">{progress}%</div>
                    <div className="progress-bar-container">
                      <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
                    </div>
                  </div>

                  <div className="checklist-items">
                    {checklist.items.map(item => {
                      const isEditing =
                        activeEditor?.type === 'edit' && activeEditor.id === item.id
                      return (
                        <div key={item.id} className={`checklist-item ${isEditing ? 'editing' : ''}`}>
                          <input
                            type="checkbox"
                            checked={item.done}
                            onChange={() => toggleChecklistItem(checklist.id, item.id)}
                          />

                          {isEditing ? (
                            <>
                              <div className="edit-item-wrapper">
                                <input
                                  type="text"
                                  className="edit-item-input"
                                  value={activeEditor.text}
                                  onChange={e =>
                                    setActiveEditor({ ...activeEditor, text: e.target.value })
                                  }
                                  autoFocus
                                />
                                <button
                                  className="remove-item-btn in-edit"
                                  onClick={() => removeChecklistItem(checklist.id, item.id)}
                                >
                                  {icons.xButton}
                                </button>
                              </div>
                              <div className="edit-actions">
                                <button
                                  className="btn-save"
                                  onClick={() =>
                                    saveEditedItem(checklist.id, item.id, activeEditor.text)
                                  }
                                >
                                  Save
                                </button>
                                <button
                                  className="btn-cancel"
                                  onClick={() => setActiveEditor(null)}
                                >
                                  Cancel
                                </button>
                              </div>
                            </>
                          ) : (
                            <>
                              <span
                                className="checklist-item-text"
                                onClick={() =>
                                  setActiveEditor({
                                    type: 'edit',
                                    id: item.id,
                                    text: item.text,
                                  })
                                }
                              >
                                {item.text}
                              </span>
                              <button
                                className="remove-item-btn"
                                onClick={() => removeChecklistItem(checklist.id, item.id)}
                              >
                                {icons.xButton}
                              </button>
                            </>
                          )}
                        </div>
                      )
                    })}

                    {isAdding ? (
                      <div className="add-item-row open">
                        <input
                          className="modal-input"
                          placeholder="Add an item"
                          value={newItemText[checklist.id] || ''}
                          onChange={ev =>
                            setNewItemText({
                              ...newItemText,
                              [checklist.id]: ev.target.value,
                            })
                          }
                          onKeyDown={ev => {
                            if (ev.key === 'Enter')
                              addChecklistItem(checklist.id, newItemText[checklist.id])
                          }}
                          autoFocus
                        />
                        <div className="add-item-actions">
                          <button
                            className="btn-save"
                            onClick={() =>
                              addChecklistItem(checklist.id, newItemText[checklist.id])
                            }
                          >
                            Add
                          </button>
                          <button className="btn-cancel" onClick={() => setActiveEditor(null)}>
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        className="add-item-btn"
                        onClick={() => setActiveEditor({ type: 'add', id: checklist.id })}
                      >
                        Add an item
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* ===== SIDEBAR ===== */}
          <div className="grid-sidebar">
            <div className="comments-section">
              <h3 className="details-title">
                <span className="svg-chat">{icons.chat}</span> Comments and activity
              </h3>
              <div className="comment-input-section">
                <input className="comment-input" placeholder="Write a comment..." />
              </div>
            </div>
          </div>
        </div>

        {activeModal && (
          <TaskDynamicModal
            type={activeModal}
            task={{ ...task, labels, members, dueDate }}
            board={board}
            onClose={() => setActiveModal(null)}
            onSave={fields => handleSave(fields)}
          />
        )}
      </div>
    </div>
  )
}
