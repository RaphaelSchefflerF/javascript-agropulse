import React, { useState, useEffect } from 'react';
import supabase from '../supabase';
import '../css/PaginaPerfil.css';
import NavBar from "../componentes/Nav-Bar";

export default function PaginaPerfil() {
    const userData = JSON.parse(localStorage.getItem('user'));
    const [usuario, setUsuario] = useState({ loading: true });
    useEffect(() => {
        const perfil = async () => {
            if (userData) {
                try {
                    const { data } = await supabase
                        .from('Usuario')
                        .select()
                        .eq('email', userData)
                        .single();
                    if (data) {
                        setUsuario({ ...data, loading: false });
                    }
                } catch (error) {
                    console.error('Erro geral:', error.message);
                }
            }
        };
        perfil();
    }, [userData]);
    return (
        <main>
            <NavBar />
            <div className="container px-4">
                <h1 className="mt-4"><i className="bi-bar-chart-line"></i> Perfil do Usuário</h1>
                <ol className="breadcrumb mb-4">
                    <li className="breadcrumb-item active">Visão Geral do Perfil</li>
                </ol>
                <div className="row">
                    <div class="col-xl-8">
                        <div class="card mb-3">
                            <div className="card-header">
                                <i class="bi-clipboard-data"></i>
                                Dados do Usuário
                            </div>
                            <div class='card-body' >
                                <form id="cadastro_usuario" method="post" class="form-card">
                                    <div class="row justify-content-between text-left">
                                        <div class="form-group col-sm-6 flex-column d-flex">
                                            <label class="form-control-label">Nome Completo: {usuario.nome || <span class="text-danger"> *</span>}</label>
                                        </div>
                                    </div>
                                    <div class="row justify-content-between text-left">
                                        <div class="form-group col-sm-6 flex-column d-flex">
                                            <label class="form-control-label">E-Mail: {usuario.email || <span class="text-danger"> *</span>}</label>
                                        </div>
                                    </div>
                                    <div class="row justify-content-between text-left">
                                        <div class="form-group col-sm-6 flex-column d-flex">
                                            <label class="form-control-label">Data de Cadastro: {usuario.created_at ? new Date(usuario.created_at).toLocaleDateString('pt-BR') : <span className="text-danger"> *</span>}
                                            </label>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main >
    );
}