import { create } from 'zustand'
import { uploadedService } from '../service/UploadedService';
import { useFilesStore } from './files.store';

export interface IUploadedFile {
    id: string;
    name: string;
    size: number;
    type: string;
    progress: number;
    status: 'uploading' | 'done' | 'error';
    error?: string;
}

interface IUploadStore {
    files: IUploadedFile[];
    isDragging: boolean;
    setIsDragging: (isDragging: boolean) => void;
    addFiles: (files: FileList) => void;
    removeFile: (id: string) => void;
    uploadFile: (file: File, id: string) => Promise<void>;
    updateFileProgress: (id: string, progress: number) => void;
    updateFileStatus: (id: string, status: IUploadedFile['status'], error?: string) => void;
    clearUploadedFiles: () => void;
    clearDoneFiles: () => void;
}

export const useUploadStore = create<IUploadStore>((set, get) => ({
    files: [],
    isDragging: false,
    setIsDragging: (isDragging: boolean) => {
        set({ isDragging });
    },
    addFiles: (files: FileList) => {
        const newFiles = Array.from(files).map(file => ({
            id: Math.random().toString(36).substring(7),
            name: file.name,
            size: file.size,
            type: file.type,
            progress: 0,
            status: 'uploading' as const
        }));

        set(state => ({
            files: [...state.files, ...newFiles]
        }));

        // Загружаем каждый файл
        newFiles.forEach(newFile => {
            const file = Array.from(files).find(f => f.name === newFile.name);
            if (!file) return;

            uploadedService.uploadFile({
                file,
                onProgress: ({ percent }: { percent: number }) => {
                    set(state => ({
                        files: state.files.map(f => 
                            f.id === newFile.id 
                                ? { ...f, progress: percent }
                                : f
                        )
                    }));
                },
                onSuccess: () => {
                    set(state => ({
                        files: state.files.map(f => 
                            f.id === newFile.id 
                                ? { ...f, status: 'done', progress: 100 }
                                : f
                        )
                    }));

                    // Обновляем список файлов после успешной загрузки
                    useFilesStore.getState().refreshFiles();

                    // Удаляем файл из списка загрузки через 1 секунду
                    setTimeout(() => {
                        set(state => ({
                            files: state.files.filter(f => f.id !== newFile.id)
                        }));
                    }, 1000);
                },
                onError: ({ error }: { error: Error }) => {
                    set(state => ({
                        files: state.files.map(f => 
                            f.id === newFile.id 
                                ? { ...f, status: 'error', error: error.message }
                                : f
                        )
                    }));
                }
            });
        });
    },
    removeFile: (id: string) => {
        set(state => ({
            files: state.files.filter(f => f.id !== id)
        }));
    },
    updateFileProgress: (id, progress) => {
        set((state) => ({
            files: state.files.map(file => 
                file.id === id ? { ...file, progress } : file
            )
        }));
    },
    updateFileStatus: (id, status, error) => {
        set((state) => ({
            files: state.files.map(file => 
                file.id === id ? { ...file, status, error } : file
            )
        }));
    },
    clearUploadedFiles: () => {
        set({ files: [] });
    },
    clearDoneFiles: () => {
        set((state) => ({
            files: state.files.filter(file => file.status !== 'done')
        }));
    },
    uploadFile: async (file: File, id: string) => {
        const store = useUploadStore.getState();
        
        try {
            await uploadedService.uploadFile({
                file,
                onProgress: ({ percent }: { percent: number }) => {
                    store.updateFileProgress(id, percent);
                },
                onSuccess: () => {
                    store.updateFileStatus(id, 'done');
                    // Удаляем файл из списка через небольшую задержку, 
                    // чтобы пользователь увидел статус успешной загрузки
                    setTimeout(() => {
                        store.removeFile(id);
                    }, 1000);
                },
                onError: ({ error }: { error: any }) => {
                    store.updateFileStatus(id, 'error', error.message || 'Ошибка загрузки');
                }
            });
        } catch (error) {
            store.updateFileStatus(id, 'error', 'Ошибка загрузки');
        }
    }
})); 