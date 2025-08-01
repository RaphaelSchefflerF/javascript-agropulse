import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Form } from 'react-bootstrap';
import '../css/PaginaFinancia.css';
import supabase from '../supabase';
import NavBar from '../componentes/Nav-Bar';
import { format } from 'date-fns';


export default function PaginaGerenciarEstoque() {
    const [dadosEstoque, setDadosEstoque] = useState([]);
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

    const fetchDados = async () => {
        const userData = JSON.parse(localStorage.getItem('user'));
        if (!userData) {
            console.error("Email do usuário não encontrado");
            return;
        }

        let query = supabase.from('Estoque').select('*').eq('email', userData);

        const { data, error } = await query;

        if (error) {
            console.error("Erro ao buscar dados Estoque:", error);
        } else {
            setDadosEstoque(data);

            const shouldShowSuccessMessage = localStorage.getItem('showSuccessMessage');
            if (shouldShowSuccessMessage === 'true') {
                setShowSuccessMessage(true);
                localStorage.removeItem('showSuccessMessage');
            }
        }
    };

    useEffect(() => {
        fetchDados();
    }, []);


    useEffect(() => {
        const filtrarDados = () => {
            if (!termoDeBusca) {
                return dadosEstoque;
            }
            return dadosEstoque.filter((item) =>
                item.produto.toLowerCase().includes(termoDeBusca.toLowerCase())
            );
        };

        const dadosFiltradosAtualizados = filtrarDados();
        setDadosFiltrados(dadosFiltradosAtualizados);
        setPaginaAtual(1);
    }, [dadosEstoque, termoDeBusca]);

    const [formData, setFormData] = useState({
        dataRecebimento: '',
        dataValidade: '',
        produto: '',
        descricao: '',
        quantidade: '',
        marca: '',
    });


    const salvarCampo = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    const SalvarInfo = async () => {

        if (!formData.dataRecebimento || !formData.dataValidade || !formData.produto || !formData.descricao || !formData.quantidade || !formData.marca) {
            alert("Por favor, preencha todos os campos.");
            return;
        }

        const emailUsuario = JSON.parse(localStorage.getItem('user'));


        const dadosParaSalvar = {
            dataRecebimento: formData.dataRecebimento,
            dataValidade: formData.dataValidade,
            produto: formData.produto,
            descricao: formData.descricao,
            quantidade: formData.quantidade,
            marca: formData.marca,
            email: emailUsuario
        };

        const { data, error } = await supabase.from('Estoque').insert([dadosParaSalvar]);



        if (error) {
            console.error('Erro ao adicionar dados:', error);
        } else {
            fetchDados();
            setShowModal(false);
            setTimeout(() => setShowSuccessMessage(false), 3000);
            localStorage.setItem('showSuccessMessage', 'true');

        }
    };

    const excluirItem = async (index) => {
        const item = dadosEstoque[index];
        const { error } = await supabase
            .from('Estoque')
            .delete()
            .match({ id: item.id });

        if (error) {
            console.error('Erro ao deletar dado:', error);
        } else {
            const novosDados = dadosEstoque.filter((_, i) => i !== index);
            setDadosEstoque(novosDados);
        }
    };


    const verDetalhes = (item) => {
        setSelecionado(item);
        setShowDetailsModal(true);
    };

    const indexDoUltimoItem = paginaAtual * itensPorPagina;
    const indexDoPrimeiroItem = indexDoUltimoItem - itensPorPagina;
    const itensAtuais = dadosFiltrados.slice(indexDoPrimeiroItem, indexDoUltimoItem);

    const formatarData = (dataString) => {
        try {
            const data = new Date(dataString);
            return format(data, 'dd/MM/yyyy'); 
        } catch (error) {
            console.error('Erro ao formatar data:', error);
            return dataString;
        }
    };

    return (
        <>
            <NavBar />
            <div class="container px-4">
                <h1 class="mt-4"><i class="bi-bar-chart-line"></i> Estoque</h1>
                <ol class="breadcrumb mb-4">
                    <li class="breadcrumb-item active">Controle do Estoque do Agronegócio</li>
                </ol>
                <div className="col-md-12 table-container">
                    {showSuccessMessage && <div class="alert alert-success alert-dismissible fade show" role="alert">
                        <strong>Sucesso!</strong> Dados adicionados na Tabela.
                        <button type="button" classNames="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>}
                    <div className="search-bar-container">
                        <input
                            type="text"
                            placeholder="Pesquisar por nome..."
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
                                <th>Data de Recebimento</th>
                                <th>Data de Validade</th>
                                <th>Produto</th>
                                <th>Quantidade</th>
                                <th>Marca</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {itensAtuais.map((item, index) => (
                                <tr key={index}>
                                    <td>{formatarData(item?.dataRecebimento)}</td>
                                    <td>{formatarData(item?.dataValidade)}</td>
                                    <td>{item?.produto}</td>
                                    <td>{item?.quantidade}</td>
                                    <td>{item?.marca}</td>
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
            </div>
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Adicionar Produto</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="formTitulo">
                            <Form.Label>Produto</Form.Label>
                            <Form.Control type="text" name="produto" value={formData.produto} onChange={salvarCampo} isInvalid={!formData.produto} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formData">
                            <Form.Label>Data de Recebimento</Form.Label>
                            <Form.Control type="date" name="dataRecebimento" value={formData.dataRecebimento} onChange={salvarCampo} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formData">
                            <Form.Label>Data de Validade</Form.Label>
                            <Form.Control type="date" name="dataValidade" value={formData.dataValidade} onChange={salvarCampo} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formDescricao">
                            <Form.Label>Descrição</Form.Label>
                            <Form.Control as="textarea" rows={3} name="descricao" value={formData.descricao} onChange={salvarCampo} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formDescricao">
                            <Form.Label>Quantidade</Form.Label>
                            <Form.Control as="textarea" rows={3} name="quantidade" value={formData.quantidade} onChange={salvarCampo} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formDescricao">
                            <Form.Label>Marca</Form.Label>
                            <Form.Control as="textarea" rows={3} name="marca" value={formData.marca} onChange={salvarCampo} />
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
                    <Modal.Title>Detalhes do Produto</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selecionado && (
                        <div>
                            <p><strong>Data de Recebimento:</strong> {selecionado.dataRecebimento}</p>
                            <p><strong>Data de Validade:</strong> {selecionado.dataValidade}</p>
                            <p><strong>Produto:</strong> {selecionado.produto}</p>
                            <p><strong>Descrição:</strong> {selecionado.descricao}</p>
                            <p><strong>Quantidade:</strong> {selecionado.quantidade}</p>
                            <p><strong>Marca:</strong> {selecionado.marca}</p>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
                        Fechar
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}