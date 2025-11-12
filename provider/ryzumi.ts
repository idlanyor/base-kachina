import axios, { AxiosInstance, AxiosResponse } from 'axios'

const baseRyzumi: AxiosInstance = axios.create({
    baseURL: 'https://api.ryzumi.vip/'
})


export const getRyzumi = async (endpoint: string, params: {}): Promise<AxiosResponse> => {
    return await baseRyzumi.get(endpoint, {
        params
    })
}
export const postRyzumi = async (endpoint: string, data: any, config: {}): Promise<AxiosResponse> => {
    return await baseRyzumi.post(endpoint, data, config)
}

