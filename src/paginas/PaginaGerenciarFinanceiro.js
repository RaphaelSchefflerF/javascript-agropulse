import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Modal, Button, Form } from 'react-bootstrap';
import '../css/PaginaFinancia.css';
import supabase from '../supabase';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import MyCalendarComponent from '../componentes/Calendario';
import NavBar from '../componentes/Nav-Bar';
import { format } from 'date-fns';

export default function PaginaGerenciarFinanceiro() {
    const [dadosFinanceiros, setDadosFinanceiros] = useState([]);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const handleOpenModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);
    const [tipoTransacao, setTipoTransacao] = useState('entrada');
    const [dataSelecionada, setDataSelecionada] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selecionado, setSelecionado] = useState(null);
    const [paginaAtual, setPaginaAtual] = useState(1);
    const itensPorPagina = 10;
    const paginar = (numeroPagina) => setPaginaAtual(numeroPagina);
    const [dadosFiltrados, setDadosFiltrados] = useState([]);
    const [termoDeBusca, setTermoDeBusca] = useState("");
    const [adicionarAoEstoque, setAdicionarAoEstoque] = useState(false);
    const [adicionarBovinos, setAdicionarBovinos] = useState(false);



    useEffect(() => {
        fetchDados();
    }, []);

    const fetchDados = async () => {
        const userData = JSON.parse(localStorage.getItem('user'));
        if (!userData) {
            console.error("Email do usuário não encontrado");
            return;
        }

        let query = supabase.from('Financeiro').select('*').eq('email', userData);

        if (dataSelecionada) {
            query = query.eq('data', dataSelecionada);
        }

        const { data, error } = await query;

        if (error) {
            console.error("Erro ao buscar dados financeiros:", error);
        } else {
            setDadosFinanceiros(data);

            const shouldShowSuccessMessage = localStorage.getItem('showSuccessMessage');
            if (shouldShowSuccessMessage === 'true') {
                setShowSuccessMessage(true);
                localStorage.removeItem('showSuccessMessage');
            }
        }
    };

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user'));
        if (!userData) {
            console.error("Email do usuário não encontrado");
            return;
        }

        let query = supabase.from('Financeiro').select('*').eq('email', userData);

        if (dataSelecionada) {
            query = query.eq('data', dataSelecionada);
        }

        query.then(({ data, error }) => {
            if (error) {
                console.error("Erro ao buscar dados:", error);
            } else {
                setDadosFinanceiros(data);
                setPaginaAtual(1);
            }
        });
    }, [dataSelecionada]);


    useEffect(() => {
        const filtrarDados = () => {
            if (!termoDeBusca) {
                return dadosFinanceiros;
            }
            return dadosFinanceiros.filter((item) =>
                item.titulo.toLowerCase().includes(termoDeBusca.toLowerCase())
            );
        };

        const dadosFiltradosAtualizados = filtrarDados();
        setDadosFiltrados(dadosFiltradosAtualizados);
        setPaginaAtual(1);
    }, [dadosFinanceiros, termoDeBusca]);

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
        if (!formData.data || !formData.titulo || !formData.descricao || !formData.valor) {
            alert("Por favor, preencha todos os campos.");
            return;
        }

        const emailUsuario = JSON.parse(localStorage.getItem('user'));

        const dadosParaSalvarFinanceiro = {
            data: formData.data,
            titulo: formData.titulo,
            descricao: formData.descricao,
            entrada: tipoTransacao === 'entrada' ? parseFloat(formData.valor) : 0,
            saida: tipoTransacao === 'saida' ? parseFloat(formData.valor) : 0,
            email: emailUsuario,
            marca: formData.marca,
            quantidade: formData.quantidade,
            dataValidade: formData.dataValidade,
        };

        const { data: dataFinanceiro, error: errorFinanceiro } = await supabase
            .from('Financeiro')
            .insert([dadosParaSalvarFinanceiro]).select();

        if (errorFinanceiro) {
            console.error('Erro ao adicionar dados em Financeiro:', errorFinanceiro);
            return;
        }

        if (dataFinanceiro) {
            setDadosFinanceiros([...dadosFinanceiros, ...dataFinanceiro]);
            

            if (adicionarBovinos) {
                const dadosParaSalvarBovinos = {
                    lote: formData.lote,
                    machos: parseInt(formData.machos),
                    femeas: parseInt(formData.femeas),
                    filhotes: parseInt(formData.filhotes),
                    qualidade_do_pasto: formData.qualidade_do_pasto,
                    raca: formData.raca,
                    email: emailUsuario,
                };

                const { error: errorBovinos } = await supabase
                    .from('Bovinos')
                    .insert([dadosParaSalvarBovinos]);

                if (errorBovinos) {
                    console.error('Erro ao adicionar dados em Bovinos:', errorBovinos);
                }
            }
            else if (adicionarAoEstoque) {
                const dadosParaSalvarEstoque = {
                    produto: formData.titulo,
                    dataValidade: formData.dataValidade,
                    descricao: formData.descricao,
                    quantidade: formData.quantidade,
                    dataRecebimento: formData.data,
                    marca: formData.marca,
                    email: emailUsuario,
                };

                const { error: errorEstoque } = await supabase
                    .from('Estoque')
                    .insert([dadosParaSalvarEstoque]);

                if (errorEstoque) {
                    console.error('Erro ao adicionar dados em Estoque:', errorEstoque);
                }
            }else{
                const dadosParaSalvarFinanceiro = {
                    data: formData.data,
                    titulo: formData.titulo,
                    descricao: formData.descricao,
                    entrada: tipoTransacao === 'entrada' ? parseFloat(formData.valor) : 0,
                    saida: tipoTransacao === 'saida' ? parseFloat(formData.valor) : 0,
                    email: emailUsuario,
                    marca: formData.marca,
                    quantidade: formData.quantidade,
                    dataValidade: formData.dataValidade,
                    
                };
                const { data: dataFinanceiro, error: errorFinanceiro } = await supabase
                .from('Financeiro')
                .insert([dadosParaSalvarFinanceiro]).select();

                if (dataFinanceiro) {
                    setDadosFinanceiros([...dadosFinanceiros, ...dataFinanceiro]);
                    

                if (errorFinanceiro) {
                    console.error('Erro ao adicionar dados em Financeiro:', errorFinanceiro);
                    return;
                }
            }
        }
            setFormData({
                data: '',
                titulo: '',
                descricao: '',
                valor: 0,
                marca: '',
                quantidade: 0,
                dataValidade: '',
                lote: '',
                machos: '',
                femeas: '',
                filhotes: '',
                qualidade_do_pasto: '',
                raca: '',
            });
            setShowModal(false);
            setShowSuccessMessage(true);
            setTimeout(() => setShowSuccessMessage(false), 3000);
            localStorage.setItem('showSuccessMessage', 'true');
        }
    };

    const excluirItem = async (index) => {
        const item = dadosFinanceiros[index];
        const { error } = await supabase
            .from('Financeiro')
            .delete()
            .match({ id: item.id });

        if (error) {
            console.error('Erro ao deletar dado:', error);
        } else {
            const novosDados = dadosFinanceiros.filter((_, i) => i !== index);
            setDadosFinanceiros(novosDados);
        }
    };


    const verDetalhes = (item) => {
        setSelecionado(item);
        setShowDetailsModal(true);
    };

    const calcularSaldoTotal = () => {
        return dadosFinanceiros.reduce((acc, item) => {
            if (item && typeof item === 'object' && 'entrada' in item && 'saida' in item) {
                return acc + item.entrada - item.saida;
            }
            return acc;
        }, 0);
    };

    const totalEntrada = dadosFinanceiros.reduce((acc, item) => {
        if (item && typeof item === 'object' && 'entrada' in item) {
            return acc + item.entrada;
        }
        return acc;
    }, 0);
    const totalSaida = dadosFinanceiros.reduce((acc, item) => {
        if (item && typeof item === 'object' && 'saida' in item) {
            return acc + item.saida;
        }
        return acc;
    }, 0);

    const dataGrafico = {
        labels: ['Entrada', 'Saída'],
        datasets: [{
            label: 'Resumo Financeiro',
            data: [totalEntrada, totalSaida],
            backgroundColor: [
                'blue',
                'red'
            ],
            borderColor: [
                'blue',
                'red'
            ],
            borderWidth: 1
        }]
    };


    const limparSelecaoData = () => {
        setDataSelecionada('');
        fetchDados();
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
            <main >
                <NavBar />
                <div class="container px-4">
                    <h1 class="mt-4"><i class="bi-bar-chart-line"></i> Financeiro</h1>
                    <ol class="breadcrumb mb-4">
                        <li class="breadcrumb-item active">Controle do Financeiro do Agronegócio</li>
                    </ol>
                    <div className="main-content">
                        <div className="row flex-grow-1">
                            <div className="col-md-8 table-container">
                                {showSuccessMessage && <div class="alert alert-success alert-dismissible fade show" role="alert">
                                    <strong>Sucesso!</strong> Dados adicionados na Tabela.
                                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
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
                                            <th>Data</th>
                                            <th>Titulo</th>
                                            <th>Entrada</th>
                                            <th>Saída</th>
                                            <th>Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {itensAtuais.map((item, index) => (
                                            <tr key={index}>
                                                <td>{formatarData(item.data)}</td>
                                                <td>{item?.titulo}</td>
                                                <td>{item?.entrada}</td>
                                                <td>{item?.saida}</td>
                                                <td>
                                                    <button onClick={() => verDetalhes(item)} className="btn btn-alert btn-sm">
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
                                <div className="data-selector-container">
                                    <div className="title-container">
                                        <h3>Calendário</h3>
                                    </div>
                                    <div className="data-selector">
                                        <MyCalendarComponent
                                            setDataSelecionada={setDataSelecionada}
                                        />
                                        <div className='d-grid gap-2'>
                                            <Button variant="secondary" onClick={limparSelecaoData}>Limpar Data</Button>
                                        </div>
                                    </div>
                                </div>
                                <div className="chart-container">
                                    <div className="title-container">
                                        <h3>Resumo Financeiro</h3>
                                    </div>
                                    <div className="chart-box">
                                        <Pie data={dataGrafico} />
                                    </div>
                                    <div className="saldo-total mb-3 align-self-center">
                                        <h3>Saldo Total: R${calcularSaldoTotal()}</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Adicionar Item Financeiro</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="formTitulo">
                            <Form.Label>Título</Form.Label>
                            <Form.Control type="text" name="titulo" value={formData.titulo} onChange={salvarCampo} isInvalid={!formData.titulo} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formData">
                            <Form.Label>Data</Form.Label>
                            <Form.Control type="date" name="data" value={formData.data} onChange={salvarCampo} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formDescricao">
                            <Form.Label>Descrição</Form.Label>
                            <Form.Control as="textarea" rows={3} name="descricao" value={formData.descricao} onChange={salvarCampo} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Tipo de Transação</Form.Label>
                            <div>
                                <Form.Check
                                    type="radio"
                                    label="Entrada"
                                    name="tipoTransacao"
                                    value="entrada"
                                    checked={tipoTransacao === 'entrada'}
                                    onChange={(e) => setTipoTransacao(e.target.value)}
                                />
                                <Form.Check
                                    type="radio"
                                    label="Saída"
                                    name="tipoTransacao"
                                    value="saida"
                                    checked={tipoTransacao === 'saida'}
                                    onChange={(e) => setTipoTransacao(e.target.value)}
                                />
                            </div>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formValor">
                            <Form.Label>Valor</Form.Label>
                            <Form.Control
                                type="number"
                                name="valor"
                                value={formData.valor}
                                onChange={salvarCampo}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formAdicionarEstoque">
                            <Form.Check
                                type="checkbox"
                                name="opcao"
                                label="Adicionar ao Estoque"
                                checked={adicionarAoEstoque}
                                onChange={() => {
                                    setAdicionarAoEstoque(true);
                                    setAdicionarBovinos(false);
                                }}
                            />
                            <Form.Check
                                type="checkbox"
                                name="opcao"
                                label="Adicionar informações de Lotes"
                                checked={adicionarBovinos}
                                onChange={() => {
                                    setAdicionarBovinos(true);
                                    setAdicionarAoEstoque(false);
                                }}
                            />
                        </Form.Group>
                        {adicionarBovinos && (
                            <>
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
                            </>
                        )}
                        {adicionarAoEstoque && (
                            <>
                                <Form.Group className="mb-3" controlId="formMarca">
                                    <Form.Label>Marca</Form.Label>
                                    <Form.Control type="text" rows={3} name="marca" value={formData.marca} onChange={salvarCampo} />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formQuantidade">
                                    <Form.Label>Quantidade</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="quantidade"
                                        value={formData.quantidade}
                                        onChange={salvarCampo}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formData">
                                    <Form.Label>Data Validade</Form.Label>
                                    <Form.Control type="date" name="dataValidade" value={formData.dataValidade} onChange={salvarCampo} />
                                </Form.Group>
                            </>
                        )}

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
                    <Modal.Title>Detalhes do Item Financeiro</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selecionado && (
                        <div>
                            <p><strong>Data:</strong> {selecionado.data}</p>
                            <p><strong>Título:</strong> {selecionado.titulo}</p>
                            <p><strong>Descrição:</strong> {selecionado.descricao}</p>
                            <p><strong>Entrada:</strong> {selecionado.entrada}</p>
                            <p><strong>Saída:</strong> {selecionado.saida}</p>
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