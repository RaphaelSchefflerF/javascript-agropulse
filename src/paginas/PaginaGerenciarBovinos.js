import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Modal, Button, Form } from 'react-bootstrap';
import '../css/PaginaBovinos.css';
import WeatherComponent from './../componentes/clima';
import supabase from '../supabase';
import NavBar from '../componentes/Nav-Bar';



export default function PaginaGerenciarBovinos() {
    const [dadosBovinos, setDadosBovinos] = useState([]);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const handleOpenModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);
    const [showModal, setShowModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selecionado, setSelecionado] = useState(null);
    const [paginaAtual, setPaginaAtual] = useState(1);
    const itensPorPagina = 10;
    const paginar = (numeroPagina) => setPaginaAtual(numeroPagina);
    const [dadosFiltrados, setDadosFiltrados] = useState([]);
    const [termoDeBusca, setTermoDeBusca] = useState("");

    const qualidades = {
        1: 'Muito bom',
        2: 'Bom',
        3: 'Media',
        4: 'Ruim',
        5: 'Muito ruim'
    }



    useEffect(() => {
        const filtrarDados = () => {
            if (!termoDeBusca) {
                return dadosBovinos;
            }
            return dadosBovinos.filter((item) =>
                item.titulo && item.titulo.toLowerCase().includes(termoDeBusca.toLowerCase())
            );
        };

        const dadosFiltradosAtualizados = filtrarDados();
        setDadosFiltrados(dadosFiltradosAtualizados);
        setPaginaAtual(1);
    }, [dadosBovinos, termoDeBusca]);


    useEffect(() => {
        fetchDados();
    }, []);

    const fetchDados = async () => {
        const userData = JSON.parse(localStorage.getItem('user'));
        if (!userData) {
            console.error("Email do usuário não encontrado");
            return;
        }

        let query = supabase.from('Bovinos').select('*').eq('email', userData);


        const { data, error } = await query;

        if (error) {
            console.error("Erro ao buscar dados bovinos:", error);
        } else {
            setDadosBovinos(data);

            const shouldShowSuccessMessage = localStorage.getItem('showSuccessMessage');
            if (shouldShowSuccessMessage === 'true') {
                setShowSuccessMessage(true);
                localStorage.removeItem('showSuccessMessage');
            }
        }
    };




    useEffect(() => {
        const filtrarDados = () => {
            if (!termoDeBusca) {
                return dadosBovinos;
            }

            const dadosFiltrados = dadosBovinos.filter((item) => {
                if (item && item.lote) {
                    return item.lote.toString().toLowerCase().includes(termoDeBusca.toLowerCase());
                }
                return false;
            });

            return dadosFiltrados;
        };

        const dadosFiltradosAtualizados = filtrarDados();
        setDadosFiltrados(dadosFiltradosAtualizados);
        setPaginaAtual(1);
    }, [dadosBovinos, termoDeBusca]);

    const [formData, setFormData] = useState({
        data: '',
        titulo: '',
        descricao: '',
        valor: 0,
    });


    const salvarCampo = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    const SalvarInfo = async () => {
        if (!formData.lote || !formData.machos || !formData.femeas || !formData.filhotes || !formData.qualidade_do_pasto || !formData.raca) {
            alert("Por favor, preencha todos os campos.");
            return;
        }

        const emailUsuario = JSON.parse(localStorage.getItem('user'));

        const dadosParaSalvar = {
            lote: formData.lote,
            machos: formData.machos,
            femeas: formData.femeas,
            filhotes: formData.filhotes,
            qualidade_do_pasto: formData.qualidade_do_pasto,
            raca: formData.raca,
            email: emailUsuario,
        };

        const { data, error } = await supabase
            .from('Bovinos')
            .insert([dadosParaSalvar]);

        if (error) {
            console.error('Erro ao adicionar dados:', error);
        } else {
            setDadosBovinos([...dadosBovinos, data]);
            setShowModal(false);
            setTimeout(() => setShowSuccessMessage(false), 3000);
            localStorage.setItem('showSuccessMessage', 'true');
            window.location.reload();
        }
    };

    const excluirItem = async (index) => {
        const item = dadosBovinos[index];
        const { error } = await supabase
            .from('Bovinos')
            .delete()
            .match({ lote: item.lote });

        if (error) {
            console.error('Erro ao deletar dado:', error);
        } else {
            const novosDados = dadosBovinos.filter((_, i) => i !== index);
            setDadosBovinos(novosDados);
        }
    };

    const verDetalhes = (item) => {
        setSelecionado(item);
        setShowDetailsModal(true);
    };

    const indexDoUltimoItem = paginaAtual * itensPorPagina;
    const indexDoPrimeiroItem = indexDoUltimoItem - itensPorPagina;
    const itensAtuais = dadosFiltrados.slice(indexDoPrimeiroItem, indexDoUltimoItem);

    return (
        <>
            < NavBar />
            <div class="container px-4">
                <h1 class="mt-4"><i class="bi-bar-chart-line"></i> Lotes</h1>
                <ol class="breadcrumb mb-4">
                    <li class="breadcrumb-item active">Controle do lotes do Agronegócio</li>
                </ol>
                <div className="main-content">
                    <div class="row flex-grow-1">
                        <div class="col-md-8 table-container">
                            {showSuccessMessage && <div class="alert alert-success alert-dismissible fade show" role="alert">
                                <strong>Sucesso!</strong> Dados adicionados na Tabela.
                                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                            </div>}
                            <div className="search-bar-container">
                                <input
                                    type="text"
                                    placeholder="Pesquisar por lote..."
                                    value={termoDeBusca}
                                    onChange={(e) => setTermoDeBusca(e.target.value)}
                                />
                            </div>
                            <Button variant="primary botao-add mb-3" onClick={handleOpenModal}>
                                Adicionar Item
                            </Button>
                            <table className='table table-striped'>
                                <thead>
                                    <tr>
                                        <th>Lote</th>
                                        <th>Machos</th>
                                        <th>Femeas</th>
                                        <th>Filhotes</th>
                                        <th>Qualidade do pasto</th>
                                        <th>Raça</th>
                                        <th>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {itensAtuais.map((item, index) => (
                                        <tr key={index}>
                                            <td>{item?.lote}</td>
                                            <td>{item?.machos}</td>
                                            <td>{item?.femeas}</td>
                                            <td>{item?.filhotes}</td>
                                            <td>{qualidades[item?.qualidade_do_pasto]}</td>
                                            <td>{item?.raca}</td>
                                            <td>
                                                <button onClick={() => verDetalhes(item)} className="btn btn-primary btn-sm">
                                                    <i className="bi bi-info-circle-fill"></i>
                                                </button>
                                                {' '}
                                                <button onClick={() => excluirItem(index)} className="btn btn-danger btn-sm">
                                                    <i className="bi bi-trash-fill"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="pagination">
                                {[...Array(Math.ceil(dadosFiltrados.length / itensPorPagina)).keys()].map(numero => (
                                    <button key={numero + 1} onClick={() => paginar(numero + 1)}>
                                        {numero + 1}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <div className="clima-selector-container">
                                <div className="title-container">
                                    <h3>Clima</h3>
                                </div>
                                <div className="clima-selector">
                                    <WeatherComponent className="WeatherComponent" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Modal show={showModal} onHide={handleCloseModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Adicionar Item Bovinos</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group className="mb-3" controlId="formTitulo">
                                <Form.Label>Lote</Form.Label>
                                <Form.Control type="number" name="lote" value={formData.lote} onChange={salvarCampo} isInvalid={!formData.titulo} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formData">
                                <Form.Label>Machos</Form.Label>
                                <Form.Control type="number" name="machos" value={formData.machos} onChange={salvarCampo} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formData">
                                <Form.Label>Fêmeas</Form.Label>
                                <Form.Control type="number" name="femeas" value={formData.femeas} onChange={salvarCampo} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formData">
                                <Form.Label>Filhotes</Form.Label>
                                <Form.Control type="number" name="filhotes" value={formData.filhotes} onChange={salvarCampo} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formDescricao">
                                <Form.Label>Qualidade do pasto</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="qualidade_do_pasto"
                                    value={formData.qualidade_do_pasto}
                                    onChange={salvarCampo}
                                >
                                    <option value="">Selecione a qualidade do pasto</option>
                                    <option value="1">Muito bom</option>
                                    <option value="2">Bom</option>
                                    <option value="3">Média</option>
                                    <option value="4">Ruim</option>
                                    <option value="5">Muito ruim</option>
                                </Form.Control>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formData">
                                <Form.Label>Raça</Form.Label>
                                <Form.Control type="text" name="raca" value={formData.raca} onChange={salvarCampo} />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>
                            Fechar
                        </Button>
                        <Button variant="primary" onClick={SalvarInfo}>
                            Salvar
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Detalhes do Item </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {selecionado && (
                            <div>
                                <p><strong>Lote:</strong> {selecionado.lote}</p>
                                <p><strong>Machos:</strong> {selecionado.machos}</p>
                                <p><strong>Fêmeas:</strong> {selecionado.femeas}</p>
                                <p><strong>Filhotes:</strong> {selecionado.filhotes}</p>
                                <p><strong>Qualidade do pasto:</strong> {selecionado.qualidade_do_pasto}</p>
                                <p><strong>Raça:</strong> {selecionado.raca}</p>
                            </div>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
                            Fechar
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </>
    );
}