import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { CartProvider } from '@/contexts/CartContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
    title: 'Comida Cubana - Auténtica Cocina Cubana',
    description: 'Disfruta de auténtica cocina cubana con entrega a domicilio. Disponible en español y ruso.',
};

export function generateViewport() {
    return {
        width: 'device-width',
        initialScale: 1,
        maximumScale: 1,
        viewportFit: 'cover',
    };
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="es" suppressHydrationWarning>
            <head>
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
                <meta name="apple-mobile-web-app-title" content="Comida Cubana" />
            </head>
            <body className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
                <ThemeProvider>
                    <LanguageProvider>
                        <AuthProvider>
                            <CartProvider>
                                <div className="min-h-screen flex flex-col">
                                    <Header />
                                    <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                                        {children}
                                    </main>
                                    <Footer />
                                </div>
                            </CartProvider>
                        </AuthProvider>
                    </LanguageProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
