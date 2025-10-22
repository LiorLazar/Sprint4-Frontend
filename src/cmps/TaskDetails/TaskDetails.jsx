import { useState, useEffect } from 'react'
import { icons } from '../SvgIcons.jsx'
import { TaskDynamicModal } from './TaskDynamicModal.jsx'
import { boardMembers, labelPalette } from '../../services/data.js'
import './TaskModals.css'

export function TaskDetails({ task, isOpen, onClose, onSave }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState(null)
  const [labels, setLabels] = useState([])
  const [members, setMembers] = useState([])
  const [activeModal, setActiveModal] = useState(null)
  const [newItemText, setNewItemText] = useState({})

  function getFormattedDate(dateValue) {
    if (!dateValue) return null
    const dateObject = new Date(dateValue)
    if (isNaN(dateObject)) return null
    return dateObject.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  useEffect(() => {
    if (isOpen && task) {
      setTitle(task.title || '')
      setDescription(task.description || '')
      setDueDate(task.dueDate || null)
      setLabels(task.labels || [])
      setMembers(task.members || [])
      document.body.classList.add('modal-open')
    }
    return () => {
      document.body.classList.remove('modal-open')
    }
  }, [isOpen, task])

  if (!isOpen || !task) return null

  function handleSave(updatedFields = {}) {
    const updatedTask = {
      ...task,
      title: title.trim(),
      description: description.trim(),
      dueDate,
      labels,
      members,
      ...updatedFields
    }
    onSave(updatedTask)
  }

  function getDueClass(dateValue) {
    if (!dateValue) return ''
    const dateObject = new Date(dateValue)
    if (isNaN(dateObject)) return ''
    const now = new Date()
    if (dateObject < now) return 'overdue'
    const differenceInDays = (dateObject - now) / (1000 * 60 * 60 * 24)
    if (differenceInDays < 1) return 'due-soon'
    return 'upcoming'
  }

  const selectedMemberObjects = boardMembers.filter(member => members?.includes(member.id))

  function getChecklistProgress(checklist) {
    if (!checklist.items.length) return 0
    const doneItems = checklist.items.filter(item => item.done).length
    return Math.round((doneItems / checklist.items.length) * 100)
  }

  function toggleChecklistItem(checklistId, itemId) {
    const updatedChecklists = task.checklists.map(checklist =>
      checklist.id === checklistId
        ? {
            ...checklist,
            items: checklist.items.map(item =>
              item.id === itemId ? { ...item, done: !item.done } : item
            )
          }
        : checklist
    )
    handleSave({ checklists: updatedChecklists })
  }

  function addChecklistItem(checklistId) {
    const text = newItemText[checklistId]?.trim()
    if (!text) return
    const updatedChecklists = task.checklists.map(checklist =>
      checklist.id === checklistId
        ? {
            ...checklist,
            items: [...checklist.items, { id: crypto.randomUUID(), text, done: false }]
          }
        : checklist
    )
    handleSave({ checklists: updatedChecklists })
    setNewItemText({ ...newItemText, [checklistId]: '' })
  }

  function removeChecklistItem(checklistId, itemId) {
    const updatedChecklists = task.checklists.map(checklist =>
      checklist.id === checklistId
        ? { ...checklist, items: checklist.items.filter(item => item.id !== itemId) }
        : checklist
    )
    handleSave({ checklists: updatedChecklists })
  }

  function onDeleteChecklist(checklistId) {
    const updatedChecklists = task.checklists.filter(checklist => checklist.id !== checklistId)
    handleSave({ checklists: updatedChecklists })
  }

  const formattedDate = getFormattedDate(dueDate)

  return (
    <div className="task-details-overlay" onClick={event => event.target === event.currentTarget && onClose()}>
      <div className="task-details-modal">
        <button className="close-btn" onClick={onClose}>{icons.xButton}</button>

        {task.attachment?.url && (
          <div className="task-cover">
            <img src={task.attachment.url} alt="Task cover" className="task-cover-image" />
          </div>
        )}

        <div className="task-details-grid">
          <div className="grid-header">
            <div className="task-location">
              in list <span className="list-name">Client Backlog</span>
            </div>
          </div>

          <div className="grid-main">
            <div className="task-title-section">
              <div className="task-icon">{icons.circle}</div>
              <input
                className="task-title-input"
                value={title}
                onChange={event => setTitle(event.target.value)}
                onBlur={() => handleSave()}
                placeholder="Enter task title..."
              />
            </div>

            <div className="action-buttons-row">
              <button className="action-button" onClick={() => setActiveModal('checklist')}>
                <span className="action-button-icon">{icons.checklistItem}</span> Checklist
              </button>
              <button className="action-button" onClick={() => setActiveModal('attachments')}>
                <span className="action-button-icon">{icons.attachment}</span> Attachment
              </button>
              {!labels.length && (
                <button className="action-button" onClick={() => setActiveModal('labels')}>
                  <span className="action-button-icon">{icons.labels}</span> Labels
                </button>
              )}
              {!dueDate && (
                <button className="action-button" onClick={() => setActiveModal('dates')}>
                  <span className="action-button-icon">{icons.clock}</span> Dates
                </button>
              )}
              {!members.length && (
                <button className="action-button" onClick={() => setActiveModal('members')}>
                  <span className="action-button-icon">{icons.member}</span> Members
                </button>
              )}
            </div>

            <div className="meta-row">
              {members.length > 0 && (
                <div className="members-inline">
                  <div className="section-header tight">
                    <h3 className="section-title">Members</h3>
                  </div>
                  <div className="members-inline-list">
                    {selectedMemberObjects.map(member => (
                      <span key={member.id} className="avatar sm" style={{ backgroundColor: member.color }}>
                        {member.initials}
                      </span>
                    ))}
                    <button className="add-member-inline" onClick={() => setActiveModal('members')}>
                      {icons.plus}
                    </button>
                  </div>
                </div>
              )}

              {labels?.length > 0 && (
                <div className="labels-inline">
                  <div className="section-header tight">
                    <h3 className="section-title">Labels</h3>
                  </div>
                  <div className="labels-inline-list">
                    {labels.map(labelId => (
                      <span key={labelId} className="label-chip-fat" style={{ backgroundColor: labelPalette[labelId] }} />
                    ))}
                    <button className="add-label-inline" onClick={() => setActiveModal('labels')}>
                      {icons.plus}
                    </button>
                  </div>
                </div>
              )}

              {dueDate && (
                <div className="due-inline">
                  <div className="section-header tight">
                    <h3 className="section-title">Due date</h3>
                  </div>
                  <div className="due-inline-controls">
                    <button
                      className={`due-pill ${getDueClass(dueDate)}`}
                      onClick={() => setActiveModal('dates')}
                    >
                      {formattedDate}
                      <span className={`due-badge ${getDueClass(dueDate)}`}>
                        {getDueClass(dueDate) === 'overdue' && 'Overdue'}
                        {getDueClass(dueDate) === 'due-soon' && 'Due soon'}
                        {getDueClass(dueDate) === 'upcoming' && 'Upcoming'}
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="task-section description-section">
              <div className="section-title">
                <div>{icons.cardDescriptions}</div>
                <h3>Description</h3>
              </div>
              <textarea
                className="description-textarea"
                value={description}
                onChange={event => setDescription(event.target.value)}
                onBlur={() => handleSave()}
                placeholder="Add a more detailed description..."
              />
            </div>

            {task.checklists?.map(checklist => (
              <div key={checklist.id} className="checklist-section">
                <div className="checklist-header">
                  <div className="section-title">
                    {icons.checklistItem}
                    <h3>{checklist.title}</h3>
                  </div>
                  <button className="delete-btn" onClick={() => onDeleteChecklist(checklist.id)}>Delete</button>
                </div>

                <div className="progress-bar-container">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${getChecklistProgress(checklist)}%` }}
                  ></div>
                </div>

                <div className="checklist-items">
                  {checklist.items.map(item => (
                    <div key={item.id} className="checklist-item">
                      <input
                        type="checkbox"
                        checked={item.done}
                        onChange={() => toggleChecklistItem(checklist.id, item.id)}
                      />
                      <span>{item.text}</span>
                      <button className="remove-item-btn" onClick={() => removeChecklistItem(checklist.id, item.id)}>
                        {icons.xButton}
                      </button>
                    </div>
                  ))}
                </div>

                <div className="add-item-row">
                  <input
                    className="modal-input"
                    placeholder="Add an item"
                    value={newItemText[checklist.id] || ''}
                    onChange={event => setNewItemText({ ...newItemText, [checklist.id]: event.target.value })}
                    onKeyDown={event => event.key === 'Enter' && addChecklistItem(checklist.id)}
                  />
                  <button onClick={() => addChecklistItem(checklist.id)}>Add</button>
                </div>
              </div>
            ))}
          </div>

          <div className="grid-sidebar">
            <div className="comments-section">
              <div>
                <h3 className="section-title">
                  <span className="svg-chat">{icons.chat}</span> Comments and activity
                </h3>
                <button className="show-details-btn">Show details</button>
              </div>
              <div className="comment-input-section">
                <input className="comment-input" placeholder="Write a comment..." />
              </div>
            </div>
          </div>
        </div>
      </div>

      {activeModal && (
        <TaskDynamicModal
          type={activeModal}
          task={{ ...task, labels, members, dueDate }}
          onClose={() => setActiveModal(null)}
          onSave={fields => {
            if (fields?.dueDate !== undefined) setDueDate(fields.dueDate)
            if (fields?.labels) setLabels(fields.labels)
            if (fields?.members) setMembers(fields.members)
            handleSave(fields || {})
          }}
        />
      )}
    </div>
  )
}
