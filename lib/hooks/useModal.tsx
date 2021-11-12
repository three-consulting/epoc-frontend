import { useState } from 'react';

interface Modal {
    show: boolean;
    toggle: () => void;
}

function useModal(): Modal {
    const [show, setShow] = useState(false);
    const toggle = () => {
        setShow(!show);
    };
    return { show, toggle };
}

export default useModal;
