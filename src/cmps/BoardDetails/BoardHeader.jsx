import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { useEffect } from 'react'

import edenImg from '../../assets/img/Eden Avgi.png'
import golanImg from '../../assets/img/Golan Asraf.png'
import liorImg from '../../assets/img/Lior Lazar.png'

import { icons } from '../SvgIcons'
import { loadBoards } from '../../store/actions/board.actions'


export function BoardHeader() {
    const { boardId } = useParams()
    const boards = useSelector(storeState => storeState.boardModule.boards)
    const currentBoard = boards.find(board => board._id === boardId)
    const starred = currentBoard?.isStarred || false


    useEffect(() => {
        if (!boards || boards.length === 0) {
            loadBoards()
        }
    }, [boards])

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
            </div>
        </section >
    )
}