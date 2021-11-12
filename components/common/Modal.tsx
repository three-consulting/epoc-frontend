import React from 'react';
import ClientOnlyPortal from './ClientOnlyPortal';

interface ModalProps {
    show: boolean;
    toggle: () => void;
    children: React.ReactNode;
}

function Modal({ show, toggle, children }: ModalProps) {
    return <></>;
}
