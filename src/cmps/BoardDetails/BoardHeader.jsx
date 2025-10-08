import edenImg from '../../assets/img/Eden Avgi.png'
import golanImg from '../../assets/img/Golan Asraf.png'
import liorImg from '../../assets/img/Lior Lazar.png'

export function BoardHeader() {
    return (
        <section className="board-header-container">
            <span className="board-name">Work-Management</span>
            <div className="collaborators flex">
                <img src={edenImg} alt="Eden Avgi" className="collaborator-img" />
                <img src={golanImg} alt="Golan Asraf" className="collaborator-img" />
                <img src={liorImg} alt="Lior Lazar" className="collaborator-img" />
            </div>
        </section>
    )
}