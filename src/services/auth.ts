import AsyncStorage from '@react-native-async-storage/async-storage'
import api from './api'

export async function logar(email: string, senha: string): Promise<string> {
  const { data } = await api.post('/usuarios/login', { email, senha })
  return data
}

export async function nomeUsuario(){
  const { data } = await api.get('/usuarios/nome')
  return data;
}

export async function cadastrar(nome: string, email: string, senha: string) {
  const { data } = await api.post('/usuarios/cadastrar', { nome, email, senha })
  return data
}

