'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/LanguageContext';

export function LanguageSelector() {
    const { language, setLanguage } = useLanguage();

    return (
        <div className="flex gap-2">
            <button
                onClick={() => setLanguage('es')}
                className={`px-3 py-1 rounded-lg font-medium transition-colors ${language === 'es'
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
            >
                ES
            </button>
            <button
                onClick={() => setLanguage('ru')}
                className={`px-3 py-1 rounded-lg font-medium transition-colors ${language === 'ru'
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
            >
                РУ
            </button>
        </div>
    );
}
