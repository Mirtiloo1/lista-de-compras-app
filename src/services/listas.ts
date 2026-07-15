import api from './api'

export async function getListas(){
    const { data } = await api.get('/listas')
    return data;
}

export async function pegarNome(id: number){
    const { data } = await api.get(`/listas/${id}`)
    return data
}

export async function criarLista(nome: string){
    const { data } = await api.post('/listas', { nome })
    return data;
}

export async function deletarLista(id: number){
    const { data } = await api.delete(`/listas/${id}`)
    return data;
}