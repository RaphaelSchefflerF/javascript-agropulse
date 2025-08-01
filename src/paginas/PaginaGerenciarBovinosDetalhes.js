import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './../css/PaginaBovinosDetalhes.css';
import { useParams } from 'react-router-dom';
import tableBovinos from  './../componentes/tableBovinos'
import NavBar from '../componentes/Nav-Bar';



export default function PaginaGerenciarBovinosDetalhes() {
    const { id } = useParams();

    return <>

        <div className='Divisao'>
            <NavBar />
            <div className='detalhes-bovinos'>
                <div className='informacoes-completas'>
                    <div className='info' id='title-info'>
                        <h3>Lote X - Raca: Nelore</h3>
                    </div>
                    <div className='info-mid'>
                        <div className='machos'>
                            <h3>Machos <span class="badge bg-secondary">10</span></h3>
                        </div>
                        <div className='status-pasto'>
                            <h3>Qualidade dos pastos:</h3>
                            <p>TA TOP</p>
                        </div>
                    </div>
                    <div className='info-mid'>
                        <div className='femeas'>
                            <h3>Femeas <span class="badge bg-secondary">10</span></h3>
                        </div>
                        <div className='status-clima'>
                            <h3>Clima</h3>
                            <p>TA TOP</p>
                        </div>
                    </div>
                    <div className='info-mid'>
                        <div className='filhote'>
                            <h3>Filhotes<span class="badge bg-secondary">10</span></h3>
                        </div>
                        <div className='status-funcionario'>
                            <h3>funcionario</h3>
                            <p>TA TOP</p>
                        </div>
                    </div>
                    <div className='happy-bar'>
                        <h3>Qualidade do gado</h3>
                        <p>fazer a loading bar</p>
                    </div>
                </div>
            </div>
        </div>
    </>
}