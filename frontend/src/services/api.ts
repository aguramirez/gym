import axios from 'axios';

const api = axios.create({
    baseURL: 'http://192.168.1.14:8080'
})

export const getClientes = async () => {
    const response = await api.get('/clientes');
    return response.data;
}

export const getEjercicios = async () => {
    const response = await api.get('/ejercicios');
    return response.data;
};

export const getRutinas = async () => {
    const response = await api.get('/rutinas');
    return response.data;
};