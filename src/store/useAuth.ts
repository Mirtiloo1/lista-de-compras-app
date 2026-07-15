import { create } from 'zustand'
import AsyncStorage from '@react-native-async-storage/async-storage'
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
    await setApiToken(token)
    const usuario = await nomeUsuario()
    set({ token, usuario })
  },

  logout: async () => {
    await clearApiToken()
    set({ token: null, usuario: null })
  },

  checkAuth: async () => {
    const token = await AsyncStorage.getItem('@token')
    if(token){
      await setApiToken(token)

      const usuario = await nomeUsuario()
      set({ token, usuario, loading: false })
    }else{
      set({ token: null, usuario: null, loading: false })
    }
  },
}))