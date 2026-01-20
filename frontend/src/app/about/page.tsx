'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';

export default function AboutPage() {
    const { t } = useTranslation();

    return (
        <div className="max-w-4xl mx-auto space-y-12">
            {/* Hero */}
            <section>
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                    Acerca de Comida Cubana
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
                    Somos una plataforma de entrega de auténtica comida cubana, dedicada a
                    traer los sabores tradicionales de Cuba directamente a tu puerta. Con
                    más de 10 años de experiencia en la gastronomía cubana, nos
                    comprometemos a ofrecer recetas auténticas preparadas con los mejores
                    ingredientes.
                </p>
            </section>

            {/* Mission and Vision */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-gray-800 p-8 rounded-lg">
                    <h2 className="text-2xl font-bold mb-4">Nuestra Misión</h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        Preservar y compartir la auténtica cocina cubana, haciendo que
                        nuestros platos tradicionales sean accesibles y disfrutables para
                        todos, sin importar dónde se encuentren.
                    </p>
                </div>

                <div className="bg-white dark:bg-gray-800 p-8 rounded-lg">
                    <h2 className="text-2xl font-bold mb-4">Nuestra Visión</h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        Ser el restaurante de comida cubana más confiable y admirado,
                        reconocido por la calidad excepcional de nuestros platos y el
                        servicio al cliente inigualable.
                    </p>
                </div>
            </section>

            {/* Values */}
            <section>
                <h2 className="text-3xl font-bold mb-8">Nuestros Valores</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        {
                            icon: '🎯',
                            title: 'Autenticidad',
                            description:
                                'Mantenemos las recetas tradicionales cubanas sin comprometer la calidad',
                        },
                        {
                            icon: '⚡',
                            title: 'Rapidez',
                            description:
                                'Entrega rápida sin sacrificar la calidad de nuestros platos',
                        },
                        {
                            icon: '❤️',
                            title: 'Pasión',
                            description:
                                'Preparamos cada plato con amor y dedicación hacia nuestros clientes',
                        },
                    ].map((value, idx) => (
                        <div
                            key={idx}
                            className="bg-white dark:bg-gray-800 p-6 rounded-lg text-center"
                        >
                            <div className="text-5xl mb-4">{value.icon}</div>
                            <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                {value.description}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Team */}
            <section>
                <h2 className="text-3xl font-bold mb-8">Nuestro Equipo</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                    Contamos con un equipo de chefs experimentados, meseros dedicados y
                    personal logístico comprometido con tu satisfacción.
                </p>
            </section>

            {/* Contact */}
            <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg p-8 text-center">
                <h2 className="text-3xl font-bold mb-4">¿Preguntas?</h2>
                <p className="mb-6">
                    Nos encantaría escuchar de ti. Contacta con nuestro equipo de soporte.
                </p>
                <a
                    href="mailto:info@comidacubana.com"
                    className="inline-block bg-white text-primary-600 font-bold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors"
                >
                    Envíanos un correo
                </a>
            </section>
        </div>
    );
}
