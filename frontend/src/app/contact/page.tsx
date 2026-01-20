'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

export default function ContactPage() {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Mensaje enviado:', formData);
        // TODO: Implementar envío de correo
        alert('Gracias por tu mensaje. Te contactaremos pronto.');
        setFormData({ name: '', email: '', subject: '', message: '' });
    };

    return (
        <div className="max-w-6xl mx-auto space-y-12">
            {/* Header */}
            <div className="text-center">
                <h1 className="text-4xl font-bold mb-4">Contacto</h1>
                <p className="text-xl text-gray-600 dark:text-gray-400">
                    ¿Preguntas o sugerencias? Nos encantaría escucharte
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Contact Info */}
                <div className="space-y-8">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
                        <div className="flex gap-4 mb-6">
                            <Phone className="w-6 h-6 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="font-bold text-lg mb-1">Teléfono</h3>
                                <a
                                    href="tel:+5352000000"
                                    className="text-primary-600 dark:text-primary-400 hover:underline"
                                >
                                    +535 200 0000
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
                        <div className="flex gap-4 mb-6">
                            <Mail className="w-6 h-6 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="font-bold text-lg mb-1">Correo</h3>
                                <a
                                    href="mailto:info@comidacubana.com"
                                    className="text-primary-600 dark:text-primary-400 hover:underline"
                                >
                                    info@comidacubana.com
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
                        <div className="flex gap-4 mb-6">
                            <MapPin className="w-6 h-6 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="font-bold text-lg mb-1">Dirección</h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Calle Principal 123<br />
                                    La Habana, Cuba 10100
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
                        <div className="flex gap-4 mb-6">
                            <Clock className="w-6 h-6 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="font-bold text-lg mb-1">Horario</h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Lunes a Viernes: 11:00 - 22:00<br />
                                    Sábado y Domingo: 12:00 - 23:00
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="bg-white dark:bg-gray-800 p-8 rounded-lg">
                    <h2 className="text-2xl font-bold mb-6">Envíanos un Mensaje</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Nombre
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Correo
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Asunto
                            </label>
                            <input
                                type="text"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Mensaje
                            </label>
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                rows={6}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                                required
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-3 rounded-lg transition-colors"
                        >
                            Enviar Mensaje
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
