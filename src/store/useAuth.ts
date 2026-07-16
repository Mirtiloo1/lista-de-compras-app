import { create } from 'zustand'
import * as SecureStore from 'expo-secure-store' 
import { logar as loginService, nomeUsuario} from '../services/auth'
import { setApiToken, clearApiToken } from '../services/api'

type Usuario = string
interface AuthState {
  token: string | null
  loading: boolean
  usuario: Usuario | null
  login: (email: string, senha: string) => Promise<void>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
}

export const useAuth = create<AuthState>((set) => ({
  token: null,
  usuario: null,
  loading: true,

  login: async (email, senha) => {
    const token = await loginService(email, senha)
    // O setApiToken já salva no SecureStore com a chave 'token'
    await setApiToken(token) 
    const usuario = await nomeUsuario()
    set({ token, usuario })
  },

  logout: async () => {
    // O clearApiToken já deleta do SecureStore
    await clearApiToken() 
    set({ token: null, usuario: null })
  },

  checkAuth: async () => {
    // 2. Buscamos do lugar certo e com a chave certa!
    const token = await SecureStore.getItemAsync('token') 
    
    if(token){
      await setApiToken(token)

      const usuario = await nomeUsuario()
      set({ token, usuario, loading: false })
    }else{
      set({ token: null, usuario: null, loading: false })
    }
  },
}))