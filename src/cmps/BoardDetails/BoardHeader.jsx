import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'

import edenImg from '../../assets/img/Eden Avgi.png'
import golanImg from '../../assets/img/Golan Asraf.png'
import liorImg from '../../assets/img/Lior Lazar.png'

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

    return (
        <section className="board-header-container">
            <span className="board-name">{currentBoard.title}</span>
            <div className='board-header-items'>
                <div className="collaborators flex">
                    <img src={edenImg} alt="Eden Avgi" className="collaborator-img" />
                    <img src={golanImg} alt="Golan Asraf" className="collaborator-img" />
                    <img src={liorImg} alt="Lior Lazar" className="collaborator-img" />
                </div>
                <span className={starred ? 'starred' : 'not-starred'}>
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