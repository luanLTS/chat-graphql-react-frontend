import React, { useState } from "react";

import { gql, useApolloClient } from "@apollo/client";

const ambiente = "11";

const EXISTE = gql`
    query Existe($nome: String!, $senha: String!) {
        existe(nome: $nome, senha: $senha) {
            id
            nome
        }
    }
`;

const MENSAGENS_AMBIENTE = gql`
    query MensagensAmbiente($ambiente: ID!) {
        mensagensPorAmbiente(ambiente: $ambiente) {
            id
            texto
            data
        }
    }
`;
const REGISTRAR_ENTRADA = gql`
    mutation RegistrarEntrada($usuario: ID!, $ambiente: ID!) {
        registrarEntrada(usuario: $usuario, ambiente: $ambiente) {
            dataEntrada
            dataSaida
        }
    }
`;
const REGISTRAR_MENSAGEM = gql`
    mutation RegistrarMensagem($usuario: ID!, $ambiente: ID!, $texto: String!) {
        registrarMensagem(
            usuario: $usuario
            ambiente: $ambiente
            texto: $texto
        ) {
            id
            texto
        }
    }
`;

const App = () => {
    const client = useApolloClient();
    const [nome, setNome] = useState("");
    const [senha, setSenha] = useState("");
    const [usuarioAtivo, setUsuarioAtivo] = useState({});

    const [isLoading, setIsLoading] = useState(false);
    const [mensagens, setMensagens] = useState([]);
    const [mensagem, setMensagem] = useState("");

    const getMensagens = async () => {
        const { data } = await client.query({
            query: MENSAGENS_AMBIENTE,
            variables: {
                ambiente,
            },
        });
        const { mensagensPorAmbiente } = data;
        console.log(mensagensPorAmbiente);
        setMensagens([...mensagensPorAmbiente]);
    };

    const fazerLogin = async () => {
        try {
            setIsLoading(true);
            const result = await client.query({
                query: EXISTE,
                variables: {
                    nome,
                    senha,
                },
            });
            console.log(result);
            const { id } = result.data.existe;
            console.log(id);
            setUsuarioAtivo({
                id,
                nome,
            });
            const participacao = await client.mutate({
                mutation: REGISTRAR_ENTRADA,
                variables: { usuario: id, ambiente },
            });
            console.log(participacao);
            setIsLoading(false);
            getMensagens();
        } catch (e) {
            console.log(e);
        }
    };

    const enviarMensagem = async () => {
        try {
            const result = await client.mutate({
                mutation: REGISTRAR_MENSAGEM,
                variables: {
                    usuario: usuarioAtivo.id,
                    ambiente,
                    texto: mensagem,
                },
            });
            console.log(result);
            setMensagem("");
        } catch (e) {
            console.log(e);
        }
    };
    return (
        <div className="container border round my-5">
            <div className="row">
                <div className="col-6">
                    <div className="form-floating my-3">
                        <input
                            type="text"
                            className="form-control"
                            id="usuarioInput"
                            placeholder="Usuário"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                        />
                        <label htmlFor="usuarioInput">Usuário</label>
                    </div>
                </div>
                <div className="col-6">
                    <div className="form-floating my-3">
                        <input
                            type="password"
                            className="form-control"
                            id="senhaInput"
                            placeholder="Senha"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                        />
                        <label htmlFor="senhaInput">Senha</label>
                    </div>
                </div>
                <div className="col-12">
                    <button
                        className="btn btn-primary w-100 mb-2"
                        onClick={fazerLogin}
                    >
                        OK
                    </button>
                </div>
            </div>
            <div className="row">
                <h5 className="text-center">
                    Usuário ativo: {usuarioAtivo?.nome}
                </h5>
            </div>
            {usuarioAtivo?.id ? (
                <div className="row">
                    <div className="col-12">
                        <div className="form-floating my-3">
                            <input
                                type="text"
                                className="form-control"
                                id="mensagemInput"
                                name="mensagemInput"
                                placeholder="Mensagem"
                                value={mensagem}
                                onChange={(e) => setMensagem(e.target.value)}
                            />
                            <label htmlFor="mensagemInput">Mensagem</label>
                            <button
                                className="btn btn-outline-secondary w-100 my-2"
                                onClick={enviarMensagem}
                            >
                                Enviar
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}

            <div className="row">
                {isLoading ? (
                    <div className="d-flex justify-content-center p-3">
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : null}
                <div className="col-8 offset-2">
                    {mensagens.length > 0
                        ? mensagens.map((m) => (
                              <div className="card">
                                  <div className="card-header">{m.data}</div>
                                  <div className="card-body">{m.texto}</div>
                              </div>
                          ))
                        : null}
                </div>
            </div>
        </div>
    );
};

export default App;
