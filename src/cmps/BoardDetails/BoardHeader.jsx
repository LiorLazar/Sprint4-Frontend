import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'

import { boardMembers } from '../../services/data.js'
import { icons } from '../SvgIcons'
import { loadBoards, updateBoard } from '../../store/actions/board.actions'
import { OptionsModal } from './OptionsModal.jsx'


export function BoardHeader() {
    const { boardId } = useParams()
    const boards = useSelector(storeState => storeState.boardModule.boards)
    const currentBoard = boards.find(board => board._id === boardId)
    const starred = currentBoard?.isStarred || false
    const [optionsModalOpen, setOptionsModalOpen] = useState(false);

    useEffect(() => {
        if (!boards || boards.length === 0) {
            loadBoards()
        }
    }, [boards])

    const handleToggleStar = async () => {
        if (currentBoard) {
            const updatedBoard = {
                ...currentBoard,
                isStarred: !currentBoard.isStarred
            }
            await updateBoard(updatedBoard)
        }
    }

    const handleChangeColor = async (colorName) => {
        if (currentBoard) {
            const updatedBoard = {
                ...currentBoard,
                style: {
                    ...currentBoard.style,
                    backgroundColor: colorName
                }
            }
            await updateBoard(updatedBoard)
        }
    }

    const handleCloseModal = () => {
        setOptionsModalOpen(false)
    }

    if (!currentBoard) {
        return (
            <section className="board-header-container">
                <span className="board-name">Loading...</span>
            </section>
        )
    }

    const selectedMembersObjects = boardMembers

    return (
        <section className="board-header-container">
            <span className="board-name">{currentBoard.title}</span>
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
                    />
                )}
            </div>
        </section >
    )
}