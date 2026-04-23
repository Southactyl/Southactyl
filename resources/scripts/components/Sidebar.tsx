import React, { ReactNode, useEffect } from 'react';
import '@/assets/css/sidebar.css';

type ParentProps = {
    children: ReactNode;
};

export default ({ children }: Omit<ParentProps, 'render'>) => {
    useEffect(() => {
        document.body.classList.add('has-client-sidebar');

        return () => {
            document.body.classList.remove('has-client-sidebar');
        };
    }, []);

    return (
        <>
            <div className='sidebar' id='sidebar'>
                {children}
            </div>
        </>
    );
};
