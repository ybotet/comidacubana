'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, Lock, User, Phone } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import apiService from '@/services/api.service';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
    const { t } = useTranslation();
    const router = useRouter();
    const { login: authLogin, register: authRegister } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        phone: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            if (isLogin) {
                // Login
                if (!formData.email || !formData.password) {
                    setError('Por favor completa todos los campos');
                    setIsLoading(false);
                    return;
                }

                const response = await apiService.login(formData.email, formData.password);

                // Guardar token y usuario
                if (response?.data?.token) {
                    localStorage.setItem('token', response.data.token);
                    if (response.data.user) {
                        localStorage.setItem('user', JSON.stringify(response.data.user));
                    }
                    // Actualizar contexto de autenticación
                    await authLogin(formData.email, formData.password);
                }

                // Redirigir al menú
                router.push('/menu');
            } else {
                // Register
                if (!formData.email || !formData.password || !formData.name || !formData.phone) {
                    setError('Por favor completa todos los campos');
                    setIsLoading(false);
                    return;
                }

                // Validate password requirements
                const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
                if (!passwordRegex.test(formData.password)) {
                    setError('La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número');
                    setIsLoading(false);
                    return;
                }

                const response = await apiService.register(
                    formData.name,
                    formData.email,
                    formData.password,
                    formData.phone
                );

                // Guardar token y usuario
                if (response?.data?.token) {
                    localStorage.setItem('token', response.data.token);
                    if (response.data.user) {
                        localStorage.setItem('user', JSON.stringify(response.data.user));
                    }
                    // Actualizar contexto de autenticación
                    await authRegister(formData.name, formData.email, formData.password, formData.phone);
                }

                // Redirigir al menú
                router.push('/menu');
            }
        } catch (err: any) {
            console.error('Auth error:', err);
            let errorMessage = isLogin ? 'Error al iniciar sesión' : 'Error al registrarse';

            if (err.response?.data?.details) {
                // Si hay detalles de validación
                const details = err.response.data.details;
                if (Array.isArray(details)) {
                    errorMessage = details.map((d: any) => d.message).join(', ');
                }
            } else if (err.response?.data?.error) {
                errorMessage = err.response.data.error;
            } else if (err.response?.data?.message) {
                errorMessage = err.response.data.message;
            } else if (err.message) {
                errorMessage = err.message;
            }

            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md">
                {/* Card */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                            <span className="text-white font-bold text-3xl">🍲</span>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {isLogin ? t('common.login') : t('common.register')}
                        </h1>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Name Field (Register only) */}
                        {!isLogin && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    {t('common.name')}
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        disabled={isLoading}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                                        placeholder="Tu nombre"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Email Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {t('common.email')}
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                                    placeholder="tu@email.com"
                                />
                            </div>
                        </div>

                        {/* Phone Field (Register only) */}
                        {!isLogin && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    {t('common.phone')}
                                </label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        disabled={isLoading}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                                        placeholder="+1 234 567 8900"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Password Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {t('common.password')}
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                                    placeholder="••••••••"
                                />
                            </div>
                            {!isLogin && (
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    Mín. 8 caracteres, 1 mayúscula, 1 minúscula y 1 número
                                </p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-primary-500 hover:bg-primary-600 disabled:bg-gray-400 text-white font-bold py-2 rounded-lg transition-colors mt-6 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Procesando...' : (isLogin ? t('common.login') : t('common.register'))}
                        </button>
                    </form>

                    {/* Toggle */}
                    <div className="text-center mt-6 text-sm text-gray-600 dark:text-gray-400">
                        {isLogin ? "¿No tienes cuenta? " : "¿Ya tienes cuenta? "}
                        <button
                            onClick={() => {
                                setIsLogin(!isLogin);
                                setError(null);
                            }}
                            disabled={isLoading}
                            className="text-primary-600 dark:text-primary-400 font-semibold hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLogin ? t('common.register') : t('common.login')}
                        </button>
                    </div>
                </div>

                {/* Back Link */}
                <div className="text-center mt-6">
                    <Link
                        href="/"
                        className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                    >
                        ← Volver al inicio
                    </Link>
                </div>
            </div>
        </div>
    );
}
