'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Facebook, Instagram, Mail, Phone } from 'lucide-react';

export function Footer() {
    const { t } = useTranslation();
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-900 dark:bg-black text-gray-300 dark:text-gray-400 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-lg">🍲</span>
                            </div>
                            <span className="font-bold text-white">{t('common.appName')}</span>
                        </div>
                        <p className="text-sm">Auténtica cocina cubana a tu puerta</p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-semibold text-white mb-4">{t('common.menu')}</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/menu" className="hover:text-primary-400 transition-colors">
                                    {t('common.categories')}
                                </Link>
                            </li>
                            <li>
                                <Link href="/orders" className="hover:text-primary-400 transition-colors">
                                    {t('common.trackOrder')}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Information */}
                    <div>
                        <h3 className="font-semibold text-white mb-4">{t('common.about')}</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/about" className="hover:text-primary-400 transition-colors">
                                    {t('common.about')}
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="hover:text-primary-400 transition-colors">
                                    {t('common.contact')}
                                </Link>
                            </li>
                            <li>
                                <Link href="/privacy" className="hover:text-primary-400 transition-colors">
                                    {t('common.privacy')}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="font-semibold text-white mb-4">{t('common.contact')}</h3>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-center gap-2">
                                <Phone size={16} />
                                <a href="tel:+5352000000" className="hover:text-primary-400 transition-colors">
                                    +535 200 0000
                                </a>
                            </li>
                            <li className="flex items-center gap-2">
                                <Mail size={16} />
                                <a href="mailto:info@comidacubana.com" className="hover:text-primary-400 transition-colors">
                                    info@comidacubana.com
                                </a>
                            </li>
                        </ul>

                        {/* Social Links */}
                        <div className="flex gap-4 mt-4">
                            <a href="#" className="p-2 bg-gray-800 hover:bg-primary-600 rounded-lg transition-colors">
                                <Facebook size={16} />
                            </a>
                            <a href="#" className="p-2 bg-gray-800 hover:bg-primary-600 rounded-lg transition-colors">
                                <Instagram size={16} />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-800 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center text-sm">
                        <p>&copy; {currentYear} Comida Cubana. Todos los derechos reservados.</p>
                        <div className="flex gap-6 mt-4 md:mt-0">
                            <Link href="/terms" className="hover:text-primary-400 transition-colors">
                                {t('common.terms')}
                            </Link>
                            <Link href="/privacy" className="hover:text-primary-400 transition-colors">
                                {t('common.privacy')}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
