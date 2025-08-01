import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from "react";
import { FaUser } from "react-icons/fa";
import './../css/Nav-Bar.css';
import supabase from '../supabase';

export default function NavBar() {
    const userData = JSON.parse(localStorage.getItem('user'));
    const [usuario, setUsuario] = useState({});

    useEffect(() => { perfil() }, []);

    const perfil = async () => {
        if (userData) {
            try {
                const { data } = await supabase
                    .from('Usuario')
                    .select()
                    .eq('email', userData)
                    .single();
                if (data) {
                    setUsuario(data);
                }
            } catch (error) {
                console.error('Erro geral:', error.message);
            }
        }
    };
    return (
        <>
            <nav className='sb-topnav navbar navbar-expand navbar-dark'>
                <div className="container">
                    <a className="navbar-brand ps-3" href="/gerencia"><img className="mb-1" width="45px" src="./../logos.png" alt="logo" /> AgroPulse</a>
                    <div className="d-none d-md-inline-block">
                        <ul class="navbar-nav me-auto mb-lg-0">
                            <li class="nav-item">
                                <a class="nav-link fw-bold linkss" href="/financeiro">Financeiro</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link fw-bold linkss" href="/estoque">Estoque</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link fw-bold linkss" href="/bovinos">Bovinos</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link fw-bold linkss" href="/afazeres">Tarefas</a>
                            </li>
                        </ul>
                    </div>
                    <ul className="navbar-nav ms-auto ms-auto me-0 me-md-3 my-2 my-md-0">
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" id="navbarDropdown" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                <FaUser className="icone-perfil" />
                            </a>
                            <ul className="dropdown-menu dropdown-menu-end " aria-labelledby="navbarDropdown">
                                <li className="dropdown-item dropsitens">Olá, {usuario.nome}</li>
                                <li><a className="dropdown-item dropsitens" href="/meu-perfil">Meu Perfil</a></li>
                                <li><hr className="dropdown-divider" /></li>
                                <li><a className="dropdown-item dropsitens" href="/">Sair</a></li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </nav>
        </>
    );
}
