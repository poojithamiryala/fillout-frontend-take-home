"use client";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: React.ReactNode;
    children: React.ReactNode;
    footer?: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children, footer }: ModalProps) {
    const [render, setRender] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setRender(true);
    }, []);

    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            if (e.key === "Escape" && isOpen) {
                onClose();
            }
        }

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    function handleBackdropClick(e: React.MouseEvent<HTMLDivElement>) {
        if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
            onClose();
        }
    }

    if (!render) return null;

    const modalRoot = document.getElementById("modal-container");
    if (!modalRoot) return null;

    return createPortal(
        <div
            role="dialog"
            aria-modal="true"
            onMouseDown={handleBackdropClick}
            className={`fixed inset-0 flex items-center justify-center bg-black/20 transition-opacity duration-300 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                }`}
        >
            <div
                ref={modalRef}
                className={`relative bg-white p-6 rounded-lg shadow-lg transition-all duration-300 transform w-full max-w-md ${isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
                    }`}
            >
                <button
                    onClick={onClose}
                    aria-label="Close modal"
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-2xl font-semibold cursor-pointer leading-none"
                >
                    &times;
                </button>
                <div className="flex justify-between items-center mb-4">
                    {title && <div className="">{title}</div>}
                </div>


                {/* Content */}
                <div className="px-2">{children}</div>

                {/* Footer */}
                {footer && <div className="mt-2">{footer}</div>}
            </div>
        </div>,
        modalRoot
    );
}
