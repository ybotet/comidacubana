import axios, { AxiosInstance } from 'axios';

class ApiService {
    private api: AxiosInstance;

    constructor() {
        this.api = axios.create({

            baseURL: 'http://localhost:3000/api/v1', // baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1',
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Agregar interceptor de request para incluir token
        this.api.interceptors.request.use((config) => {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        });

        // Agregar interceptores para manejo de errores
        this.api.interceptors.response.use(
            (response) => response,
            (error) => {
                console.error('API Error:', error.response?.data || error.message);
                return Promise.reject(error);
            }
        );
    }

    // Autenticación
    async login(email: string, password: string) {
        const { data } = await this.api.post('/auth/login', { email, password });
        return data;
    }

    async register(name: string, email: string, password: string, phone: string) {
        // Split name into first_name and last_name
        const nameParts = name.trim().split(' ');
        const first_name = nameParts[0];
        const last_name = nameParts.slice(1).join(' ') || nameParts[0];

        const { data } = await this.api.post('/auth/register', {
            first_name,
            last_name,
            email,
            password,
            phone,
        });
        return data;
    }

    // Platos
    async getDishes(category?: string) {
        const { data } = await this.api.get('/dishes', {
            params: { category },
        });
        return data;
    }

    async getDish(id: string) {
        const { data } = await this.api.get(`/dishes/${id}`);
        return data;
    }

    async getCategories() {
        const { data } = await this.api.get('/categories');
        return data;
    }

    // Pedidos
    async getOrders() {
        const { data } = await this.api.get('/orders');
        return data;
    }

    async getOrder(id: string) {
        const { data } = await this.api.get(`/orders/${id}`);
        return data;
    }

    async createOrder(orderData: any) {
        const { data } = await this.api.post('/orders', orderData);
        return data;
    }

    async updateOrderStatus(id: string, status: string) {
        const { data } = await this.api.patch(`/orders/${id}`, { status });
        return data;
    }

    // Carrito
    async getCart() {
        const { data } = await this.api.get('/cart');
        return data;
    }

    async addToCart(dishId: string, quantity: number, customizations?: any) {
        const { data } = await this.api.post('/cart/items', {
            dishId,
            quantity,
            customizations,
        });
        return data;
    }

    async removeFromCart(dishId: string) {
        const { data } = await this.api.delete(`/cart/items/${dishId}`);
        return data;
    }

    // Direcciones
    async getAddresses() {
        const { data } = await this.api.get('/addresses');
        return data;
    }

    async createAddress(address: any) {
        const { data } = await this.api.post('/addresses', address);
        return data;
    }

    async updateAddress(id: string, address: any) {
        const { data } = await this.api.patch(`/addresses/${id}`, address);
        return data;
    }

    async deleteAddress(id: string) {
        const { data } = await this.api.delete(`/addresses/${id}`);
        return data;
    }
}

const apiService = new ApiService();
export default apiService;
export { apiService };
