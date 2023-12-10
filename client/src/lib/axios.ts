import { API_URL } from '@/config/env'
import Axios from 'axios'

export const axios = Axios.create({ baseURL: API_URL })

axios.interceptors.response.use((response) => response.data)
