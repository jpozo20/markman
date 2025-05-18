import { useState, useEffect } from 'react';

const useWindowSize = () => {
    const isWindow = typeof window !== 'undefined';

    const getWindowDimensions = () => {
        const height = isWindow ? window.innerHeight : 0;
        const width = isWindow ? window.innerWidth : 0;
        return { height, width };
    }

    const [windowSize, setWindowSize] = useState(getWindowDimensions());

    useEffect(() => {
        if (!isWindow) return;
        function onResize(){ setWindowSize(getWindowDimensions()) }

        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);

    }, [isWindow])

    return windowSize;

}

export default useWindowSize;
