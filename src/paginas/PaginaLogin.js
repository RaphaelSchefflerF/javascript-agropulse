import React, { useState } from 'react';
import {Form} from 'react-bootstrap';
import './../css/PaginaLogin.css';
import { Link, useNavigate } from 'react-router-dom';
import supabase from '../supabase';


export default function PaginaLogin() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (event) => {
        if (email !== '' || senha !== '') {
            event.preventDefault();
            try {
                const { data, error } = await supabase
                    .from('Usuario')
                    .select()
                    .eq('email', email)
                    .eq('senha', senha)
                    .single();

                if (error) {
                    console.error('Erro ao fazer login:', error.message);
                } else {
                    if (data) {
                        localStorage.setItem('user', JSON.stringify(data.email));
                        navigate('/gerencia');
                    } else {
                        console.error('Credenciais inválidas');
                    }
                }
            } catch (error) {
                console.error('Erro geral:', error.message);
            }
        }
    };
    return (
        <>
            <div className="login-page">
                <div className="login-card">
                    <div className="welcome-section">
                        <h1>Bem Vindo!</h1>
                        <Link to="/cadastro">
                            <button className="btn-create-account">Criar conta</button>
                        </Link>
                    </div>
                    <div className="login-section">
                        <h2>Faça Login</h2>
                        <Form onSubmit={handleLogin}>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Control
                                    type="email"
                                    placeholder="Usuário"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Control
                                    type="password"
                                    placeholder="Senha"
                                    value={senha}
                                    onChange={(e) => setSenha(e.target.value)}
                                />
                            </Form.Group>
                            <button type="submit" className="login-button">Entrar</button>
                        </Form>
                    </div>
                </div>
            </div>
        </>
    );
}