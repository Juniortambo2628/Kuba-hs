"use client";

import React, { useState } from 'react';
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';

import axiosInstance from '@/lib/axios';
import {
    compressImageFile,
    compressionPresetForCollection,
    type ImageCompressionPreset,
} from '@/lib/image-compression';

// Register plugins
registerPlugin(FilePondPluginImagePreview, FilePondPluginFileValidateType);

interface KubaFilePondProps {
    modelType: string;
    modelId: string;
    collection: string;
    onSuccess?: (response: any) => void;
    label?: string;
    allowMultiple?: boolean;
    acceptedFileTypes?: string[];
    compressionPreset?: ImageCompressionPreset;
}

export function KubaFilePond({
    modelType,
    modelId,
    collection,
    onSuccess,
    label = 'Drag & Drop your image or <span class="filepond--label-action">Browse</span>',
    allowMultiple = false,
    acceptedFileTypes = ['image/*'],
    compressionPreset,
}: KubaFilePondProps) {
    const preset = compressionPreset ?? compressionPresetForCollection(collection);
    const [files, setFiles] = useState<any[]>([]);

    return (
        <div className="kuba-filepond-wrapper">
            <FilePond
                files={files}
                onupdatefiles={setFiles}
                allowMultiple={allowMultiple}
                maxFiles={5}
                server={{
                    process: (fieldName, file, metadata, load, error, progress, abort) => {
                        const controller = new AbortController();

                        (async () => {
                        const source =
                            file instanceof File
                                ? file
                                : new File([file], (file as File).name || 'upload.jpg', {
                                      type: file.type || 'image/jpeg',
                                  });
                        const uploadFile = await compressImageFile(source, { preset });

                        const formData = new FormData();
                        formData.append('file', uploadFile);
                        formData.append('model_type', modelType);
                        formData.append('model_id', modelId);
                        formData.append('collection', collection);

                        axiosInstance.post('/api/media/upload', formData, {
                            signal: controller.signal,
                            onUploadProgress: (e) => {
                                progress(true, e.loaded, e.total || 1);
                            },
                        })
                        .then((res) => {
                            load(res.data.id);
                            if (onSuccess) onSuccess(res.data);
                        })
                        .catch((err) => {
                            error(err.message);
                        });
                        })();

                        return {
                            abort: () => {
                                controller.abort();
                                abort();
                            },
                        };
                    },
                }}
                name="file"
                labelIdle={label}
                acceptedFileTypes={acceptedFileTypes}
                className="premium-filepond"
            />
            <style jsx global>{`
                .premium-filepond .filepond--panel-root {
                    background-color: #f8fafc;
                    border-radius: 1.5rem;
                    border: 2px dashed #e2e8f0;
                }
                .premium-filepond .filepond--drop-label {
                    color: #475569;
                    font-family: inherit;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    font-size: 0.75rem;
                }
                .premium-filepond .filepond--label-action {
                    text-decoration-color: #0284c7;
                    color: #0284c7;
                }
                .premium-filepond .filepond--item-panel {
                    background-color: #0284c7;
                    border-radius: 1rem;
                }
            `}</style>
        </div>
    );
}
