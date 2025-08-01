import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./../css/PaginaGerencia.css";
import NavBar from "../componentes/Nav-Bar";
import { GoGraph } from "react-icons/go";
import Grafico from "../componentes/Grafico";
import GraficoLinha from "../componentes/Grafico-Linha";
import supabase from "../supabase";

export default function PaginaGerencia() {
  const [dadosFinanceiros, setDadosFinanceiros] = useState({});
  const [dadosEstoque, setDadosEstoque] = useState({});
  const [dadosBovinos, setDadosBovinos] = useState({});
  const [dadosTarefas, setDadosTarefas] = useState({});
  const [minProduct, setMinProduct] = useState(null);
  const [maxProduct, setMaxProduct] = useState(null);

  const totalEntrada = Object.values(dadosFinanceiros).reduce((acc, item) => {
    if (item && typeof item === "object" && "entrada" in item) {
      return acc + item.entrada;
    }
    return acc;
  }, 0);

  const totalSaida = Object.values(dadosFinanceiros).reduce((acc, item) => {
    if (item && typeof item === "object" && "saida" in item) {
      return acc + item.saida;
    }
    return acc;
  }, 0);

  const totalFinanceiro = totalEntrada - totalSaida;

  const totalProdutos = Object.values(dadosEstoque).reduce((acc, item) => {
    if (item && typeof item === "object" && "quantidade" in item) {
      return acc + item.quantidade;
    }
    return acc;
  }, 0);

  const totalFemeas = Object.values(dadosBovinos).reduce((acc, item) => {
    if (item && typeof item === "object" && "femeas" in item) {
      return acc + item.femeas;
    }
    return acc;
  }, 0);

  const totalMachos = Object.values(dadosBovinos).reduce((acc, item) => {
    if (item && typeof item === "object" && "machos" in item) {
      return acc + item.machos;
    }
    return acc;
  }, 0);

  const totalFilhotes = Object.values(dadosBovinos).reduce((acc, item) => {
    if (item && typeof item === "object" && "filhotes" in item) {
      return acc + item.filhotes;
    }
    return acc;
  }, 0);

  const totalBovinos = totalFemeas + totalMachos + totalFilhotes;

  const totalPendentes = Object.values(dadosTarefas).reduce((acc, item) => {
    if (item && typeof item === "object" && "status" in item && !item.status) {
      return acc + 1;
    }
    return acc;
  }, 0);

  const totalConcluidas = Object.values(dadosTarefas).reduce((acc, item) => {
    if (item && typeof item === "object" && "status" in item && item.status) {
      return acc + 1;
    }
    return acc;
  }, 0);

  const totalTarefas = totalPendentes + totalConcluidas;

  // useEffect(() => {
  //   fetchDados();
  // }, []);

  useEffect(() => {
    findMinMaxProducts(dadosEstoque);
  }, [dadosEstoque]);

  const fetchDados = async () => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (!userData) {
      console.error("Email do usuário não encontrado");
      return;
    }

    const { data: dadosFinanceiros, error: errorFinanceiro } = await supabase
      .from("Financeiro")
      .select()
      .eq("email", userData);

    const { data: dadosEstoque, error: errorEstoque } = await supabase
      .from("Estoque")
      .select()
      .eq("email", userData);

    const { data: dadosBovinos, error: errorBovinos } = await supabase
      .from("Bovinos")
      .select()
      .eq("email", userData);

    const { data: dadosTarefas, error: errorTarefas } = await supabase
      .from("Afazeres")
      .select()
      .eq("email", userData);

    if (errorFinanceiro || errorEstoque || errorBovinos || errorTarefas) {
      console.error(
        "Erro ao buscar dados:",
        errorFinanceiro,
        errorEstoque,
        errorBovinos,
        errorTarefas
      );
      return;
    }
    setDadosFinanceiros(dadosFinanceiros);
    setDadosEstoque(dadosEstoque);
    setDadosBovinos(dadosBovinos);
    setDadosTarefas(dadosTarefas);
  };

  const findMinMaxProducts = (data) => {
    let minProduct = null;
    let maxProduct = null;
    Object.values(data).forEach((item) => {
      if (item && typeof item === "object" && "quantidade" in item) {
        if (!minProduct || item.quantidade < minProduct.quantidade) {
          minProduct = item;
        }

        if (!maxProduct || item.quantidade > maxProduct.quantidade) {
          maxProduct = item;
        }
      }
    });
    console.log(minProduct, maxProduct);
    setMinProduct(minProduct);
    setMaxProduct(maxProduct);
  };

  return (
    <>
      <NavBar />
      <div className="container px-4">
        <h1 className="mt-4">
          <i className="bi-bar-chart-line"></i> Página Inicial
        </h1>
        <ol className="breadcrumb mb-4">
          <li className="breadcrumb-item active">
            Visão Geral do Controle de Estoque
          </li>
        </ol>
        <div className="row">
          <div className="col-xl-3 col-md-6">
            <div className="card mb-4 corcard1">
              <div className="card-body">
                <table height="100%">
                  <tbody>
                    <tr>
                      <td>Total Entrada: R$ {totalEntrada || 0}</td>
                    </tr>
                    <tr>
                      <td>Total de Saída: R$ {totalSaida || 0}</td>
                    </tr>
                    <tr>
                      <td>Total: R$ {totalFinanceiro || 0}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="card-footer d-flex align-items-center justify-content-between">
                <a className="small text-black" href="/financeiro">
                  Ver Relação do Financeiro
                </a>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-md-6">
            <div className="card mb-4 corcard2">
              <div className="card-body">
                <table height="100%">
                  <tbody>
                    <tr>
                      <td>
                        Maior Quantidade:{" "}
                        {maxProduct ? maxProduct.produto : "N/A"}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Menor Quantidade:{" "}
                        {minProduct ? minProduct.produto : "N/A"}
                      </td>
                    </tr>
                    <tr>
                      <td>Total de Produtos: {totalProdutos || 0}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="card-footer d-flex align-items-center justify-content-between">
                <a className="small text-black" href="/estoque">
                  Ver Relação de Estoque
                </a>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-md-6">
            <div className="card mb-4 corcard1">
              <div className="card-body">
                <table height="100%">
                  <tbody>
                    <tr>
                      <td>Machos: {totalMachos || 0}</td>
                    </tr>
                    <tr>
                      <td>Fêmeas: {totalFemeas || 0}</td>
                    </tr>
                    <tr>
                      <td>Total de Bovinos: {totalBovinos || 0}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="card-footer d-flex align-items-center justify-content-between">
                <a className="small text-black" href="/bovinos">
                  Ver Relação de Bovinos
                </a>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-md-6">
            <div className="card mb-4 corcard2">
              <div className="card-body">
                <table height="100%">
                  <tbody>
                    <tr>
                      <td>Tarefas Pendentes: {totalPendentes || 0}</td>
                    </tr>
                    <tr>
                      <td>Tarefas Concluídas: {totalConcluidas || 0}</td>
                    </tr>
                    <tr>
                      <td>Total de Tarefas: {totalTarefas || 0}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="card-footer d-flex align-items-center justify-content-between">
                <a className="small text-black" href="/afazeres">
                  Ver Relação de Tarefas
                </a>
              </div>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-md-6">
            <div class="card d-flex">
              <div class="card-header">
                <GoGraph />
                Entradas e Saídas dos Ultimos Meses
              </div>
              <div class="card-body">
                <GraficoLinha dadosFinanceiros={dadosFinanceiros} />
              </div>
            </div>
          </div>

          <div class="col-md-6">
            <div class="card d-flex">
              <div className="card-header">
                <GoGraph />
                Quantidade de Bovinos
              </div>
              <div class="card-body">
                <Grafico dadosBovinos={dadosBovinos} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
