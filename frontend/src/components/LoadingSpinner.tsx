'use client';

import React from 'react';

export function LoadingSpinner() {
    return (
        <div className="flex items-center justify-center py-12">
            <div className="relative w-12 h-12">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full animate-spin"
                    style={{
                        background: 'conic-gradient(from 0deg, #0ea5e9, #f97316, #0ea5e9)',
                        opacity: 0.5
                    }}>
                </div>
                <div className="absolute inset-2 bg-white dark:bg-gray-900 rounded-full"></div>
            </div>
        </div>
    );
}
