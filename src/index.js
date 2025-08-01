//
import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
//Imports de CSS
import './index.css';

//Imports de Paginas
import PaginaLogin from './paginas/PaginaLogin';
import PaginaGerencia from './paginas/PaginaGerencia';
import PaginaGerenciarFinanceiro from './paginas/PaginaGerenciarFinanceiro';
import PaginaGerenciarEstoque from './paginas/PaginaGerenciarEstoque';
import PaginaGerenciarBovinos from './paginas/PaginaGerenciarBovinos';
import PaginaCadastro from './paginas/PaginaCadastro';
import PaginaPerfil from './paginas/PaginaPerfil';
import PaginaGerenciarBovinosDetalhes from './paginas/PaginaGerenciarBovinosDetalhes';
import PaginaAfazeres from './paginas/PaginaAfazeres';

//Criando o roteador
const roteador = createBrowserRouter([
  //Definindo as rotas
  { path: '/', element: <PaginaLogin /> },
  { path: '/gerencia', element: <PaginaGerencia /> },
  { path: '/financeiro', element: <PaginaGerenciarFinanceiro /> },
  { path: '/estoque', element: <PaginaGerenciarEstoque /> },
  { path: '/bovinos', element: <PaginaGerenciarBovinos /> },
  { path: '/bovinos/:id', element: <PaginaGerenciarBovinosDetalhes /> },
  { path: '/cadastro', element: <PaginaCadastro /> },
  { path: '/meu-perfil', element: <PaginaPerfil /> },
  { path: '/afazeres', element: <PaginaAfazeres /> },
]);
//Renderizando o roteador
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={roteador} />
  </React.StrictMode>,
);

reportWebVitals();
