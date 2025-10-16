import { useState, useEffect, useMemo } from 'react'
import { icons } from '../SvgIcons.jsx'
import { TaskDynamicModal } from './TaskDynamicModal.jsx'
import './TaskModals.css'

export function TaskDetails({ task, isOpen, onClose, onSave }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState(null)
  const [labels, setLabels] = useState([])
  const [members, setMembers] = useState([])
  const [activeModal, setActiveModal] = useState(null)

  const boardMembers = useMemo(() => ([
    { id: 'ea', name: 'Eden Avgi', initials: 'EA', color: '#1f845a' },
    { id: 'ga', name: 'golan asraf', initials: 'GA', color: '#0c66e4' },
    { id: 'll', name: 'lior lazar', initials: 'LL', color: '#1d7aFC' },
    { id: 'r', name: 'reutery1', initials: 'R', color: '#8270db' },
  ]), [])

  const labelPalette = useMemo(() => ({
    green: '#61bd4f',
    yellow: '#f2d600',
    orange: '#ff9f1a',
    red: '#eb5a46',
    purple: '#c377e0',
    blue: '#0079bf',
  }), [])

  const formattedDate = useMemo(() => {
    if (!dueDate) return null
    const d = new Date(dueDate)
    if (isNaN(d)) return null
    return d.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }, [dueDate])

  useEffect(() => {
    if (isOpen && task) {
      setTitle(task.title || '')
      setDescription(task.description || '')
      setDueDate(task.dueDate || null)
      setLabels(task.labels || [])
      setMembers(task.members || [])
      document.body.style.overflow = 'hidden'
      document.body.classList.add('modal-open')
    }
    return () => {
      document.body.style.overflow = ''
      document.body.classList.remove('modal-open')
    }
  }, [isOpen, task])

  if (!isOpen || !task) return null

  function handleSave(updatedFields = {}) {
    const merged = {
      ...task,
      title: title.trim(),
      description: description.trim(),
      dueDate,
      labels,
      members,
      ...updatedFields,
    }
    onSave(merged)
  }

  function dueClass(dateVal) {
    if (!dateVal) return ''
    const d = new Date(dateVal)
    if (isNaN(d)) return ''
    const now = new Date()
    if (d < now) return 'overdue'
    const diff = (d - now) / (1000 * 60 * 60 * 24)
    if (diff < 1) return 'due-soon'
    return 'upcoming'
  }

  const selectedMemberObjs = boardMembers.filter(m => members?.includes(m.id))

  return (
    <div className="task-details-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="task-details-modal">
        <button className="close-btn" onClick={onClose}>{icons.xButton}</button>

        <div className="task-details-grid">
          <div className="grid-header">
            <div className="task-location">in list <span className="list-name">Client Backlog</span></div>
          </div>

          <div className="grid-main">
            <div className="task-title-section">
              <div className="task-icon">{icons.circle}</div>
              <input
                className="task-title-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={() => handleSave()}
                placeholder="Enter task title..."
              />
            </div>

            <div className="action-buttons-row">
              <button className="action-button" onClick={() => setActiveModal('add')}>
                <span className="action-button-icon">{icons.plus}</span> Add
              </button>
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
                    {selectedMemberObjs.map(m => (
                      <span key={m.id} className="avatar sm" style={{ backgroundColor: m.color }}>{m.initials}</span>
                    ))}
                    <button className="add-member-inline" onClick={() => setActiveModal('members')}>{icons.plus}</button>
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
                    <button className="add-label-inline" onClick={() => setActiveModal('labels')}>{icons.plus}</button>
                  </div>
                </div>
              )}

              {dueDate && (
                <div className="due-inline">
                  <div className="section-header tight">
                    <h3 className="section-title">Due date</h3>
                  </div>
                  <div className="due-inline-controls">
                    <button className={`due-pill ${dueClass(dueDate)}`} onClick={() => setActiveModal('dates')}>
                      <span className="due-pill-icon">{icons.clock}</span>
                      {formattedDate}
                      <span className="due-badge">Due soon</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="task-section description-section">
              <div className="section-header">
                <div className="section-icon">{icons.cardDescriptions}</div>
                <h3 className="section-title">Description</h3>
              </div>
              <textarea
                className="description-textarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onBlur={() => handleSave()}
                placeholder="Add a more detailed description..."
              />
            </div>
          </div>

          <div className="grid-sidebar">
            <div className="comments-section">
              <div className="section-header">
                <h3 className="section-title"><span className="svg-chat">{icons.chat}</span> Comments and activity</h3>
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
          onSave={(fields) => {
            if (fields?.dueDate !== undefined) setDueDate(fields.dueDate)
            if (fields?.labels) setLabels(fields.labels)
            if (fields?.members) setMembers(fields.members)
            handleSave(fields || {})
            setActiveModal(null)
          }}
        />
      )}
    </div>
  )
}
