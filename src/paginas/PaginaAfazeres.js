import React, { useState, useEffect } from 'react';
import supabase from '../supabase';
import './../css/Afazeres.css';
import NavBar from '../componentes/Nav-Bar';

const PaginaAfazeres = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [afazeres, setAfazeres] = useState([]);
  const [modal, setModal] = useState(false);
  const [descricao, setDescricao] = useState(''); // [1]
  const [id, setId] = useState(0);
  const estiloModal = {
    display: modal ? 'flex' : 'none',
  };

  const inserirAfazer = async (event) => {
    event.preventDefault();
    const descricao = event.target.descricao.value;
    const dados = {
      descricao: descricao,
      status: false,
      email: user,
    };
    await supabase
      .from('Afazeres')
      .insert([dados])
      .then(() => {
        setAfazeres([...afazeres, { descricao }]);
      });
  };
  const remover = async (id) => {
    setAfazeres(afazeres.filter((afazer) => afazer.id !== id));
    await supabase.from('Afazeres').delete().match({ id });
  };
  const editar = async (event) => {
    event.preventDefault();
    const descricao = event.target.descricao.value;
    const dados = {
      descricao: descricao,
    };
    await supabase.from('Afazeres').update(dados).match({ id });
    setAfazeres(afazeres.map((afazer) => (afazer.id === id ? dados : afazer)));
  };
  useEffect(() => {
    (async () => {
      if (!user) return;
      const { data } = await supabase
        .from('Afazeres')
        .select('*')
        .eq('email', user)
        .order('id', { ascending: false });
      setAfazeres(data);
    })();
  }, [user]);
  return (
    <>
      <NavBar />
      <div className="container px-4">
        <h1 className="mt-4"><i className="bi-bar-chart-line"></i> Lista de Tarefas</h1>
        <ol className="breadcrumb mb-4">
          <li className="breadcrumb-item active">Visão Geral de uma Lista de Tarefas</li>
        </ol>
        <div className="row">
          <div className="col-md-12">
            <div className="Adicionar">
              <form
                className="formulario-adicionar"
                role="search"
                onSubmit={inserirAfazer}
              >
                <label htmlFor="descricao">Descrição: </label>
                <input
                  type="text"
                  id="descricao"
                  className="form-control me-2"
                  maxLength={50}
                  minLength={3}
                  required
                />
                <button type="submit" className="btn btn-success botao-add">
                  Adicionar
                </button>
              </form>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <ul className="lista">
                {afazeres.map((afazer) => (
                  <li key={afazer.id}>
                    <h3>{afazer.descricao}</h3>
                    <div className="imagem">
                      <input
                        type="checkbox"
                        checked={afazer.status}
                        className="checkbox-tarefa"
                        onClick={async () => {
                          setAfazeres(
                            afazeres.map((tarefa) => {
                              if (tarefa.id === afazer.id) {
                                tarefa.status = !afazer.status;
                              }
                              return tarefa;
                            }),
                          );
                          const st = !afazer.status ? 'FALSE' : 'TRUE';
                          await supabase
                            .from('Afazeres')
                            .update({ status: st })
                            .match({ id: afazer.id });
                        }}
                      />
                      <img
                        className="editar"
                        src="edit.png"
                        alt="editar"
                        width={40}
                        height={40}
                        onClick={() => {
                          setModal(true);
                          setId(afazer.id);
                        }}
                      />
                      <div className="modal-afazeres" style={estiloModal}>
                        <div className="modal-content-afazeres">
                          <form
                            className="formulario-editar"
                            role="search"
                            onSubmit={editar}
                          >
                            <label htmlFor="descricao">Descrição</label>
                            <input
                              type="text"
                              id="descricao"
                              className="form-control me-2 input-editar"
                              maxLength={50}
                              minLength={3}
                              onChange={(e) => {
                                setDescricao(e.target.value);
                              }}
                              required
                            />
                            <div>
                              <button
                                className="btn btn-danger"
                                onClick={() => {
                                  setModal(false);
                                }}
                              >
                                Cancelar
                              </button>
                              <button
                                type="submit"
                                className="btn btn-success"
                                onClick={() => {
                                  if (descricao.length >= 3) {
                                    setModal(false);
                                  }
                                }}
                              >
                                Salvar
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                      <img
                        className="remover"
                        src="remove.png"
                        alt="remover"
                        width={40}
                        height={40}
                        onClick={() => remover(afazer.id)}
                      />
                    </div>
                  </li>
                ))}
              </ul>

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaginaAfazeres;
