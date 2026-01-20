'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';

export default function NotFound() {
    const { t } = useTranslation();

    return (
        <div className="text-center py-16">
            <div className="text-6xl mb-4">404</div>
            <h1 className="text-3xl font-bold mb-2">{t('common.notFound')}</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
                Lo sentimos, la página que buscas no existe.
            </p>
            <a
                href="/"
                className="inline-block bg-primary-500 hover:bg-primary-600 text-white font-bold px-8 py-3 rounded-lg transition-colors"
            >
                Volver al inicio
            </a>
        </div>
    );
}
