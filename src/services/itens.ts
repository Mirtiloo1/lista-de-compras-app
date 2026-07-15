import api from './api'

export async function getItens(listaId: number){
    const { data } = await api.get(`/listas/${listaId}/itens`);
    return data;
}

export async function criarItem(listaId: number, nome: string, quantidade: number, preco?: number){
    const { data } = await api.post(`/listas/${listaId}/itens`, { nome, quantidade, preco });
    return data;
}

export async function marcarPego(listaId: number, itemId: number){
    const { data } = await api.patch(`/listas/${listaId}/itens/${itemId}/pego`)
    return data;
}

export async function editarItem(listaId: number, itemId: number, dadosEditados : { nome: string, preco?: number, quantidade?: number}){
    const { data } = await api.patch(`/listas/${listaId}/itens/${itemId}/editar`, dadosEditados)
    return data;
}

export async function deletarItem(itemId: number, listaId: number){
    await api.delete(`/listas/${listaId}/itens/${itemId}`)
}