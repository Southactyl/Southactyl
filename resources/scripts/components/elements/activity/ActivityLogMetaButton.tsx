import React, { useState } from 'react';
import { ClipboardListIcon } from '@heroicons/react/outline';
import { Dialog } from '@/components/elements/dialog';
import { Button } from '@/components/elements/button/index';

export default ({ meta }: { meta: Record<string, unknown> }) => {
    const [open, setOpen] = useState(false);

    return (
        <div className={'self-center md:px-4'}>
            <Dialog open={open} onClose={() => setOpen(false)} hideCloseIcon title={'Metadata'}>
                <pre
                    className={'rounded p-2 font-mono text-sm leading-relaxed overflow-x-scroll whitespace-pre-wrap'}
                    style={{
                        background: 'var(--theme-input-background)',
                        border: '1px solid color-mix(in srgb, var(--theme-input-border) 80%, transparent)',
                        color: 'var(--theme-text-primary)',
                    }}
                >
                    {JSON.stringify(meta, null, 2)}
                </pre>
                <Dialog.Footer>
                    <Button.Text onClick={() => setOpen(false)}>Close</Button.Text>
                </Dialog.Footer>
            </Dialog>
            <button
                aria-describedby={'View additional event metadata'}
                className={'p-2 transition-colors duration-100'}
                style={{ color: 'var(--theme-text-muted)' }}
                onClick={() => setOpen(true)}
            >
                <ClipboardListIcon className={'w-5 h-5'} />
            </button>
        </div>
    );
};
