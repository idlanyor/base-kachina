import axios, { AxiosInstance, AxiosResponse } from 'axios'

const baseAntidonasi: AxiosInstance = axios.create({
    baseURL: 'https://ytdlp.antidonasi.web.id/'
})


export const getAntidonasi = async (endpoint: string, params: {}): Promise<AxiosResponse> => {
    return await baseAntidonasi.get(endpoint, {
        params
    })
}
export const PostAntidonasi = async (endpoint: string, data: any, config?: {}): Promise<AxiosResponse> => {
    return await baseAntidonasi.post(endpoint, data, config)
}

