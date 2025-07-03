'use client';

import { useEffect } from 'react';

interface ToastProps {
    message: string;
    visible: boolean;
    onClose: () => void;
}

export default function Toast({ message, visible, onClose }: ToastProps) {
    useEffect(() => {
        if (visible) {
            const timer = setTimeout(onClose, 3000);
            return () => clearTimeout(timer);
        }
    }, [visible, onClose]);

    if (!visible) return null;

    return (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white px-5 py-3 rounded-lg shadow-lg animate-fade-in cursor-pointer select-none"
            onClick={onClose}
            role="alert"
            aria-live="assertive"
        >
            {message}
        </div>
    );
}
