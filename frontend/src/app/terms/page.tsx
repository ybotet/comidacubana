'use client';

import React from 'react';

export default function TermsPage() {
    return (
        <div className="max-w-4xl mx-auto prose dark:prose-invert">
            <h1>Términos y Condiciones</h1>

            <p>
                Última actualización: {new Date().toLocaleDateString('es-ES')}
            </p>

            <h2>1. Aceptación de Términos</h2>
            <p>
                Al usar Comida Cubana, aceptas estos términos y condiciones en su
                totalidad. Si no estás de acuerdo, no uses nuestros servicios.
            </p>

            <h2>2. Descripción del Servicio</h2>
            <p>
                Comida Cubana proporciona una plataforma para ordenar comida cubana con
                entrega a domicilio. Los precios y disponibilidad están sujetos a cambios.
            </p>

            <h2>3. Proceso de Pedido</h2>
            <ul>
                <li>Debes ser mayor de 18 años</li>
                <li>La información debe ser precisa y completa</li>
                <li>Nos reservamos el derecho de rechazar pedidos</li>
                <li>Los precios están sujetos a cambios sin previo aviso</li>
            </ul>

            <h2>4. Pago</h2>
            <ul>
                <li>El pago debe realizarse según lo indicado</li>
                <li>Aceptamos múltiples métodos de pago</li>
                <li>Los cargos son finales y no reembolsables</li>
                <li>Proveemos recibos digitales</li>
            </ul>

            <h2>5. Entrega</h2>
            <ul>
                <li>Los tiempos de entrega son estimados</li>
                <li>No somos responsables de retrasos</li>
                <li>La entrega es solo dentro de nuestra área de cobertura</li>
                <li>Debes estar disponible al momento de entrega</li>
            </ul>

            <h2>6. Cancelaciones y Reembolsos</h2>
            <ul>
                <li>Las cancelaciones se permiten antes de que comience la preparación</li>
                <li>Los reembolsos se procesan en 5-7 días hábiles</li>
                <li>No hay reembolsos para entregas completadas</li>
            </ul>

            <h2>7. Limitación de Responsabilidad</h2>
            <p>
                Comida Cubana no es responsable por daños indirectos, incidentales o
                punitivos. Nuestra responsabilidad se limita al monto del pedido.
            </p>

            <h2>8. Cambios en los Términos</h2>
            <p>
                Nos reservamos el derecho de cambiar estos términos en cualquier momento.
                El uso continuado constituye aceptación de los cambios.
            </p>

            <h2>9. Contacto</h2>
            <p>
                Para preguntas sobre estos términos, contacta a:
                legal@comidacubana.com
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
