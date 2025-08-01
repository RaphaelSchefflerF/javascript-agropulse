import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { createClient } from "@supabase/supabase-js";
import './../css/PaginaCadastro.css';

const supabase = createClient('https://lvazfosttoyjpxitqbsw.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2YXpmb3N0dG95anB4aXRxYnN3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY5ODM3MDk5NSwiZXhwIjoyMDEzOTQ2OTk1fQ.FQw2RBBAZ-mKgungAnN0pS_F-VXe8J6_5eAaRFKMMSY');

export default function PaginaCadastro() {
    const [nome, setNome] = useState('');
    const [cpf, setCPF] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [validoNome, setValidoNome] = useState(true);
    const [validoCPF, setValidoCPF] = useState(true);
    const [validoEmail, setValidoEmail] = useState(true);
    const [validoSenha, setValidoSenha] = useState(true);
    const navigate = useNavigate();

    const handleCadastro = async (event) => {
        event.preventDefault();


        const nomeValido = nome !== '';
        const cpfValido = cpf.match(/^\d{3}\.\d{3}\.\d{3}\-\d{2}$/);
        const emailValido = email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
        const senhaValida = senha.length >= 6;

        setValidoNome(nomeValido);
        setValidoCPF(cpfValido);
        setValidoEmail(emailValido);
        setValidoSenha(senhaValida);

        if (!nomeValido || !cpfValido || !emailValido || !senhaValida) {
            return;
        }

        try {
            const { data, error } = await supabase
                .from('Usuario')
                .upsert([
                    {
                        nome,
                        cpf,
                        email,
                        senha,
                    },
                ]);

            if (error) {
                console.error('Erro ao cadastrar usuário:', error.message);

            } else {
                console.log('Usuário cadastrado com sucesso:', data);
                navigate('/');
            }
        } catch (error) {
            console.error('Erro geral:', error.message);

        }
    };
    
    return (
        <>
            <div className="cadastro-page d-flex align-items-center justify-content-center min-vh-100">
                <div className="cadastro-card">
                    <div className="cadastro-section">
                        <h2 className="texto-cadastro my-5">Cadastro</h2>
                        <Form onSubmit={handleCadastro}>
                            <Form.Group className="mb-3" controlId="formNome">
                                <Form.Control
                                    type="text"
                                    placeholder="Digite seu nome"
                                    value={nome}
                                    onChange={(e) => setNome(e.target.value)}
                                />
                            </Form.Group>
                            {!validoNome && <Alert variant="danger">Nome inválido!</Alert>}
                            <Form.Group className="mb-3" controlId="formCPF">
                                <Form.Control
                                    type="text"
                                    placeholder="Digite seu cpf"
                                    value={cpf}
                                    onChange={(e) => setCPF(e.target.value)}
                                />
                            </Form.Group>
                            {!validoCPF && <Alert variant="danger">CPF inválido!</Alert>}
                            <Form.Group className="mb-3" controlId="formEmail">
                                <Form.Control
                                    type="email"
                                    placeholder="Digite seu email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </Form.Group>
                            {!validoEmail && <Alert variant="danger">Email inválido!</Alert>}
                            <Form.Group className="mb-3" controlId="formSenha">
                                <Form.Control
                                    type="password"
                                    placeholder="Digite sua senha"
                                    value={senha}
                                    onChange={(e) => setSenha(e.target.value)}
                                />
                            </Form.Group>
                            {!validoSenha && <Alert variant="danger">Senha inválida!</Alert>}
                            <Button variant="success" type="submit" className="mt-3">
                                Registrar
                            </Button>
                        </Form>
                        <p className="mt-4 links">
                            Já tem uma conta? <Link to='/' className='linkss'>Faça login aqui</Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}