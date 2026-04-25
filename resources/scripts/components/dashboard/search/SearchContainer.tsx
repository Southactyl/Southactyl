import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import useEventListener from '@/plugins/useEventListener';
import SearchModal from '@/components/dashboard/search/SearchModal';
import Tooltip from '@/components/elements/tooltip/Tooltip';
import { NavLink } from 'react-router-dom';

interface Props {
    asSidebarLink?: boolean;
    className?: string;
}

export default ({ asSidebarLink = false, className }: Props) => {
    const [visible, setVisible] = useState(false);

    useEventListener('keydown', (e: KeyboardEvent) => {
        if (['input', 'textarea'].indexOf(((e.target as HTMLElement).tagName || 'input').toLowerCase()) < 0) {
            if (!visible && e.metaKey && e.key.toLowerCase() === '/') {
                setVisible(true);
            }
        }
    });

    if (asSidebarLink) {
        return (
            <>
                {visible && <SearchModal appear visible={visible} onDismissed={() => setVisible(false)} />}
                <NavLink
                    to={'#'}
                    className={className}
                    isActive={() => false}
                    onClick={(e) => {
                        e.preventDefault();
                        setVisible(true);
                    }}
                >
                    <div className={'icon'}>
                        <FontAwesomeIcon icon={faSearch} />
                    </div>
                    Search
                </NavLink>
            </>
        );
    }

    return (
        <>
            {visible && <SearchModal appear visible={visible} onDismissed={() => setVisible(false)} />}
            <Tooltip placement={'bottom'} content={'Search'}>
                <div className={'navigation-link'} onClick={() => setVisible(true)}>
                    <FontAwesomeIcon icon={faSearch} />
                </div>
            </Tooltip>
        </>
    );
};
