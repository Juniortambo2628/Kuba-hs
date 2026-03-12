import React, { useEffect, useState } from 'react';
import Uppy from '@uppy/core';
import { Dashboard } from '@uppy/react';
import ThumbnailGenerator from '@uppy/thumbnail-generator';
import XHRUpload from '@uppy/xhr-upload';

import '@uppy/core/dist/style.min.css';
import '@uppy/dashboard/dist/style.min.css';

const FileUpload = ({ 
    endpoint, 
    onSuccess, 
    maxFiles = 5, 
    allowedFileTypes = ['image/*'],
    fieldName = 'file'
}) => {
    const [uppy] = useState(() => new Uppy({
        id: 'uppy-uploader',
        autoProceed: false,
        debug: true,
        restrictions: {
            maxNumberOfFiles: maxFiles,
            allowedFileTypes: allowedFileTypes,
        },
    })
    .use(ThumbnailGenerator)
    .use(XHRUpload, {
        endpoint: endpoint,
        fieldName: fieldName,
        headers: {
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? '',
        },
    }));

    useEffect(() => {
        uppy.on('complete', (result) => {
            if (result.successful.length > 0) {
                onSuccess?.(result.successful);
            }
        });

        return () => uppy.close();
    }, [uppy, onSuccess]);

    return (
        <div className="w-full">
            <Dashboard 
                uppy={uppy}
                width="100%"
                height={350}
                showProgressDetails={true}
                proudlyDisplayPoweredByUppy={false}
                note="Premium file upload system"
                theme="light"
            />
        </div>
    );
};

export default FileUpload;
