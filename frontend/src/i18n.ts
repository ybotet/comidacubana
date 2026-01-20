'use client';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import esCommon from './locales/es/common.json';
import ruCommon from './locales/ru/common.json';

const resources = {
    es: {
        common: esCommon,
    },
    ru: {
        common: ruCommon,
    },
};

if (!i18n.isInitialized) {
    i18n
        .use(initReactI18next)
        .init({
            resources,
            lng: typeof window !== 'undefined' ? localStorage.getItem('language') || 'es' : 'es',
            ns: ['common'],
            defaultNS: 'common',
            fallbackLng: 'es',
            interpolation: {
                escapeValue: false,
            },
        });
}

export default i18n;
