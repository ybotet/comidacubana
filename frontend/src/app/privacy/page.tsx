'use client';

import React from 'react';

export default function PrivacyPage() {
    return (
        <div className="max-w-4xl mx-auto prose dark:prose-invert">
            <h1>Política de Privacidad</h1>

            <p>
                Última actualización: {new Date().toLocaleDateString('es-ES')}
            </p>

            <h2>1. Introducción</h2>
            <p>
                En Comida Cubana, valoramos tu privacidad. Esta política explica cómo
                recopilamos, usamos, divulgamos y protegemos tu información.
            </p>

            <h2>2. Información que Recopilamos</h2>
            <h3>Información Directa</h3>
            <ul>
                <li>Nombre y correo electrónico</li>
                <li>Número de teléfono</li>
                <li>Dirección de entrega</li>
                <li>Historial de pedidos</li>
                <li>Preferencias de comida</li>
            </ul>

            <h3>Información Automática</h3>
            <ul>
                <li>Dirección IP</li>
                <li>Tipo de navegador</li>
                <li>Páginas visitadas</li>
                <li>Cookies y datos de sesión</li>
            </ul>

            <h2>3. Cómo Usamos Tu Información</h2>
            <ul>
                <li>Procesar tus pedidos</li>
                <li>Enviar confirmaciones y actualizaciones</li>
                <li>Mejorar nuestros servicios</li>
                <li>Personalizar tu experiencia</li>
                <li>Cumplir obligaciones legales</li>
            </ul>

            <h2>4. Compartir Información</h2>
            <p>
                No vendemos tu información personal. Solo compartimos con:
            </p>
            <ul>
                <li>Proveedores de logística (para entregas)</li>
                <li>Procesadores de pago</li>
                <li>Autoridades legales (si es requerido)</li>
            </ul>

            <h2>5. Seguridad</h2>
            <p>
                Implementamos medidas de seguridad para proteger tu información,
                incluyendo encriptación SSL y protección de datos.
            </p>

            <h2>6. Tus Derechos</h2>
            <p>
                Tienes derecho a:
            </p>
            <ul>
                <li>Acceder a tus datos personales</li>
                <li>Corregir información incorrecta</li>
                <li>Solicitar la eliminación de datos</li>
                <li>Optar por no recibir comunicaciones de marketing</li>
            </ul>

            <h2>7. Contacto</h2>
            <p>
                Si tienes preguntas sobre esta política, contacta a:
                privacy@comidacubana.com
            </p>

            <style jsx>{`
        .prose {
          max-width: none;
        }

        .prose h2 {
          @apply text-2xl font-bold mt-8 mb-4;
        }

        .prose h3 {
          @apply text-xl font-bold mt-6 mb-3;
        }

        .prose p {
          @apply my-4 text-gray-700 dark:text-gray-300;
        }

        .prose ul {
          @apply list-disc list-inside space-y-2 my-4 text-gray-700 dark:text-gray-300;
        }
      `}</style>
        </div>
    );
}
