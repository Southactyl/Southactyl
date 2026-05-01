import React, { ReactNode, useEffect, useState } from 'react';
import '@/assets/css/sidebar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

type ParentProps = {
    children: ReactNode;
};

export default ({ children }: Omit<ParentProps, 'render'>) => {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        document.body.classList.add('has-client-sidebar');

        return () => {
            document.body.classList.remove('has-client-sidebar');
        };
    }, []);

    useEffect(() => {
        const onResize = () => {
            if (window.innerWidth > 1150) {
                setIsOpen(false);
            }
        };

        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    return (
        <>
            <button
                type={'button'}
                className={'sidebar-mobile-toggle'}
                aria-label={'Open sidebar'}
                onClick={() => setIsOpen((value) => !value)}
            >
                <FontAwesomeIcon icon={faBars} />
            </button>
            <div
                className={`sidebar-backdrop${isOpen ? ' active' : ''}`}
                onClick={() => setIsOpen(false)}
                role={'presentation'}
            />
            <div
                className={`sidebar${isOpen ? ' active-nav' : ''}`}
                id='sidebar'
                onClick={(event) => {
                    const target = event.target as HTMLElement;
                    if (target.closest('a') && window.innerWidth <= 1150) {
                        setIsOpen(false);
                    }
                }}
            >
                {children}
            </div>
        </>
    );
};
