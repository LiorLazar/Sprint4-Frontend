import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'

import { boardMembers } from '../../services/data.js'
import { icons } from '../SvgIcons'
import { loadBoards, updateBoard } from '../../store/actions/board.actions'
import { OptionsModal } from './OptionsModal.jsx'

export function BoardHeader({ hasImageBg = false }) {
    const { boardId } = useParams()
    const boards = useSelector(storeState => storeState.boardModule.boards)
    const boardFromStore = useSelector(storeState => storeState.boardModule.board)
    const currentBoard = boardFromStore || boards.find(board => board._id === boardId)
    const starred = currentBoard?.isStarred || false
    const [optionsModalOpen, setOptionsModalOpen] = useState(false)
    const [isEditingTitle, setIsEditingTitle] = useState(false)
    const [titleValue, setTitleValue] = useState('')

    useEffect(() => {
        if (!boards || boards.length === 0) {
            loadBoards()
        }
    }, [boards])

    useEffect(() => {
        if (currentBoard) {
            setTitleValue(currentBoard.title || '')
        }
    }, [currentBoard])

    const handleToggleStar = async () => {
        if (!currentBoard) return
        const updatedBoard = { ...currentBoard, isStarred: !currentBoard.isStarred }
        await updateBoard(updatedBoard)
    }

    const handleChangeColor = async (colorHex) => {
        if (!currentBoard) return
        const updatedBoard = {
            ...currentBoard,
            style: {
                ...currentBoard.style,
                backgroundColor: colorHex,
                backgroundImage: null
            }
        }
        await updateBoard(updatedBoard)
    }

    const handleChangeBackgroundImage = async (imageUrl) => {
        if (!currentBoard) return
        const updatedBoard = {
            ...currentBoard,
            style: {
                ...currentBoard.style,
                backgroundImage: imageUrl || null,
                backgroundColor: imageUrl ? null : (currentBoard.style?.backgroundColor || null)
            }
        }
        await updateBoard(updatedBoard)
    }

    const handleCloseModal = () => setOptionsModalOpen(false)
    const handleTitleClick = () => setIsEditingTitle(true)
    const handleTitleChange = (e) => setTitleValue(e.target.value)

    const handleTitleBlur = async () => {
        setIsEditingTitle(false)
        const trimmed = titleValue.trim()
        if (!trimmed || trimmed === currentBoard.title) {
            setTitleValue(currentBoard.title)
            return
        }
        await updateBoard({ ...currentBoard, title: trimmed })
    }

    const handleTitleKeyDown = (e) => {
        if (e.key === 'Enter') e.target.blur()
        else if (e.key === 'Escape') {
            setTitleValue(currentBoard.title)
            setIsEditingTitle(false)
        }
    }

    if (!currentBoard) {
        return (
            <section className={`board-header-container ${hasImageBg ? 'with-image' : ''}`}>
                <span className="board-name">Loading...</span>
            </section>
        )
    }

    const selectedMembersObjects = boardMembers

    return (
        <section className={`board-header-container ${hasImageBg ? 'with-image' : ''}`}>
            {isEditingTitle ? (
                <input
                    type="text"
                    className="board-name-input"
                    value={titleValue}
                    onChange={handleTitleChange}
                    onBlur={handleTitleBlur}
                    onKeyDown={handleTitleKeyDown}
                    autoFocus
                />
            ) : (
                <span className="board-name" onClick={handleTitleClick}>
                    {currentBoard.title}
                </span>
            )}

            <div className='board-header-items'>
                <div className='members-inline-list'>
                    {selectedMembersObjects.map(member => (
                        <span
                            key={member.id}
                            className="avatar sm"
                            style={{ backgroundColor: member.color }}
                        >
                            {member.initials}
                        </span>
                    ))}
                </div>

                <span className={starred ? 'starred' : 'not-starred'} onClick={handleToggleStar}>
                    {starred ? icons.starFilled : icons.star}
                </span>

                <button
                    className='btn-options'
                    onClick={() => setOptionsModalOpen(!optionsModalOpen)}
                >
                    <span className='more-options'>{icons.dots}</span>
                </button>

                {optionsModalOpen && (
                    <OptionsModal
                        board={currentBoard}
                        onClose={handleCloseModal}
                        onToggleStar={handleToggleStar}
                        onChangeColor={handleChangeColor}
                        onChangeBackgroundImage={handleChangeBackgroundImage}
                    />
                )}
            </div>
        </section>
    )
}
