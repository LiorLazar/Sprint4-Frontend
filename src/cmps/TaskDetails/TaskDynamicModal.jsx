import { useEffect, useRef, useState } from 'react'
import { icons } from '../SvgIcons.jsx'

export function TaskDynamicModal({ type, task, anchor, onClose, onSave }) {
  const [date, setDate] = useState(task?.dueDate ? new Date(task.dueDate).toISOString().slice(0, 16) : '')
  const [reminder, setReminder] = useState(task?.dueReminder || '1d')
  const [checklistTitle, setChecklistTitle] = useState('Checklist')
  const [copyFrom, setCopyFrom] = useState('(none)')
  const [link, setLink] = useState('')
  const [displayText, setDisplayText] = useState('')
  const [labels, setLabels] = useState(task?.labels || [])
  const [members, setMembers] = useState(task?.members || [])

  const boardMembers = [
    { id: 'ea', name: 'Eden Avgi', initials: 'EA', color: '#1f845a' },
    { id: 'ga', name: 'Golan Asraf', initials: 'GA', color: '#0c66e4' },
    { id: 'll', name: 'Lior Lazar', initials: 'LL', color: '#1d7aFC' },
    { id: 'r', name: 'Reut Ery', initials: 'R', color: '#8270db' },
  ]

  const labelPalette = [
    { id: 'green', color: '#61bd4f' },
    { id: 'yellow', color: '#f2d600' },
    { id: 'orange', color: '#ff9f1a' },
    { id: 'red', color: '#eb5a46' },
    { id: 'purple', color: '#c377e0' },
    { id: 'blue', color: '#0079bf' },
  ]

  const boxRef = useRef(null)
  const [position, setPosition] = useState({ top: 100, left: 100, width: 360 })

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
    setLabels(prevLabels =>
      prevLabels.includes(labelId)
        ? prevLabels.filter(existingLabel => existingLabel !== labelId)
        : [...prevLabels, labelId]
    )
  }

  function toggleMember(memberId) {
    setMembers(prevMembers =>
      prevMembers.includes(memberId)
        ? prevMembers.filter(existingMember => existingMember !== memberId)
        : [...prevMembers, memberId]
    )
  }

  function saveDates() {
    if (!date) {
      onSave({ dueDate: null })
      return
    }
    onSave({ dueDate: new Date(date).toISOString(), dueReminder: reminder })
  }

  function saveChecklist() {
    const newChecklist = {
      id: crypto.randomUUID(),
      title: checklistTitle,
      items: [],
      copiedFrom: copyFrom,
    }
    onSave({ checklists: [...(task.checklists || []), newChecklist] })
  }

  function saveLabels() {
    onSave({ labels })
  }

  function saveMembers() {
    onSave({ members })
  }

  function attach() {
    if (!link && !displayText) return onClose()
    const newAttachment = {
      id: crypto.randomUUID(),
      url: link,
      text: displayText,
      createdAt: Date.now(),
    }
    onSave({ attachments: [...(task.attachments || []), newAttachment] })
  }

  function getHeaderText() {
    switch (type) {
      case 'labels':
        return 'Labels'
      case 'checklist':
        return 'Add checklist'
      case 'members':
        return 'Members'
      case 'attachments':
        return 'Attach'
      case 'dates':
      default:
        return 'Dates'
    }
  }

  return (
    <div className="submodal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      {type === 'labels' && (
        <div
          ref={boxRef}
          className="smart-modal"
          style={{ position: 'fixed', top: position.top, left: position.left, width: position.width }}
          onClick={e => e.stopPropagation()}
        >
          <div className="smart-modal-header">
            <h2>{getHeaderText()}</h2>
            <button className="close-btn" onClick={onClose}>{icons.xButton}</button>
          </div>
          <div className="smart-modal-body">
            <input className="modal-input" placeholder="Search labels..." />
            <div className="labels-list">
              {labelPalette.map(label => (
                <label key={label.id} className="label-row">
                  <input
                    type="checkbox"
                    checked={labels.includes(label.id)}
                    onChange={() => toggleLabel(label.id)}
                  />
                  <span className="label-long" style={{ backgroundColor: label.color }} />
                  <button className="label-edit">{icons.pencil}</button>
                </label>
              ))}
            </div>
          </div>
          <div className="smart-modal-footer">
            <button className="primary" onClick={saveLabels}>Save</button>
            <button className="secondary" onClick={onClose}>Cancel</button>
          </div>
        </div>
      )}

      {type === 'members' && (
        <div
          ref={boxRef}
          className="smart-modal"
          style={{ position: 'fixed', top: position.top, left: position.left, width: position.width }}
          onClick={e => e.stopPropagation()}
        >
          <div className="smart-modal-header">
            <h2>{getHeaderText()}</h2>
            <button className="close-btn" onClick={onClose}>{icons.xButton}</button>
          </div>
          <div className="smart-modal-body">
            <input className="modal-input" placeholder="Search members" />
            <div className="members-list-rows">
              {boardMembers.map(member => (
                <label key={member.id} className="member-row">
                  <input
                    type="checkbox"
                    checked={members.includes(member.id)}
                    onChange={() => toggleMember(member.id)}
                  />
                  <span className="avatar sm" style={{ backgroundColor: member.color }}>
                    {member.initials}
                  </span>
                  <span className="member-name">{member.name}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="smart-modal-footer">
            <button className="primary" onClick={saveMembers}>Save</button>
            <button className="secondary" onClick={onClose}>Cancel</button>
          </div>
        </div>
      )}

      {type === 'checklist' && (
        <div
          ref={boxRef}
          className="smart-modal"
          style={{ position: 'fixed', top: position.top, left: position.left, width: position.width }}
          onClick={e => e.stopPropagation()}
        >
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
            <label>Copy items from...</label>
            <select className="modal-input" value={copyFrom} onChange={e => setCopyFrom(e.target.value)}>
              <option>(none)</option>
              <optgroup label="App Header"><option>Sub Tasks</option></optgroup>
              <optgroup label="Board Details"><option>Sub Tasks</option></optgroup>
              <optgroup label="Board Header"><option>Sub Tasks</option></optgroup>
              <optgroup label="Board Index"><option>Sub Tasks</option></optgroup>
            </select>
          </div>
          <div className="smart-modal-footer">
            <button className="primary" onClick={saveChecklist}>Add</button>
            <button className="secondary" onClick={onClose}>Cancel</button>
          </div>
        </div>
      )}

      {type === 'attachments' && (
        <div
          ref={boxRef}
          className="smart-modal"
          style={{ position: 'fixed', top: position.top, left: position.left, width: position.width }}
          onClick={e => e.stopPropagation()}
        >
          <div className="smart-modal-header">
            <h2>{getHeaderText()}</h2>
            <button className="close-btn" onClick={onClose}>{icons.xButton}</button>
          </div>
          <div className="smart-modal-body">
            <div className="drawer-group">
              <div className="drawer-title">Attach a file from your computer</div>
              <div className="drawer-sub">You can also drag and drop files to upload them.</div>
              <button className="file-btn">Choose a file</button>
            </div>
            <div className="drawer-group">
              <div className="drawer-title">Search or paste a link</div>
              <input
                className="modal-input"
                placeholder="Find recent links or paste a new link"
                value={link}
                onChange={e => setLink(e.target.value)}
              />
              <div className="drawer-title">Display text (optional)</div>
              <input
                className="modal-input"
                placeholder="Text to display"
                value={displayText}
                onChange={e => setDisplayText(e.target.value)}
              />
              <div className="drawer-hint">Give this link a title or description</div>
            </div>
          </div>
          <div className="smart-modal-footer">
            <button className="primary" onClick={attach}>Attach</button>
            <button className="secondary" onClick={onClose}>Cancel</button>
          </div>
        </div>
      )}

      {(type === 'dates' || !type) && (
        <div
          ref={boxRef}
          className="smart-modal"
          style={{ position: 'fixed', top: position.top, left: position.left, width: position.width }}
          onClick={e => e.stopPropagation()}
        >
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
            <label>Set due date reminder</label>
            <select className="modal-input" value={reminder} onChange={e => setReminder(e.target.value)}>
              <option value="none">None</option>
              <option value="1h">1 hour before</option>
              <option value="1d">1 day before</option>
              <option value="2d">2 days before</option>
              <option value="1w">1 week before</option>
            </select>
            <div className="reminder-note">
              Reminders will be sent to all members and watchers of this card.
            </div>
          </div>
          <div className="smart-modal-footer">
            <button className="primary" onClick={saveDates}>Save</button>
            <button className="secondary" onClick={onClose}>Cancel</button>
            <button className="link-danger" onClick={() => { onSave({ dueDate: null }); onClose(); }}>Remove</button>
          </div>
        </div>
      )}
    </div>
  )
}
