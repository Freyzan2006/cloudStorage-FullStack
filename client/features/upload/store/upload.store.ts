import { create } from 'zustand'
import { uploadedService } from '../service/UploadedService';

export interface IUploadedFile {
    id: number;
    name: string;
    size: number;
    type: string;
    progress?: number;
    status?: 'uploading' | 'done' | 'error';
    error?: string;
}

interface IUploadStore {
    files: IUploadedFile[];
    isDragging: boolean;
    setIsDragging: (isDragging: boolean) => void;
    addFiles: (fileList: FileList) => void;
    removeFile: (id: number) => void;
    uploadFile: (file: File, id: number) => Promise<void>;
    updateFileProgress: (id: number, progress: number) => void;
    updateFileStatus: (id: number, status: IUploadedFile['status'], error?: string) => void;
    clearUploadedFiles: () => void;
    clearDoneFiles: () => void;
}

export const useUploadStore = create<IUploadStore>((set) => ({
    files: [],
    isDragging: false,
    setIsDragging: (isDragging) => set({ isDragging }),
    addFiles: (fileList) => {
        const newFiles = Array.from(fileList).map((file, index) => ({
            id: Date.now() + index,
            name: file.name,
            size: file.size,
            type: file.type,
            progress: 0,
            status: 'uploading' as const
        }));
        set((state) => ({ files: [...state.files, ...newFiles] }));

        // Начинаем загрузку каждого файла
        newFiles.forEach((fileInfo) => {
            const file = Array.from(fileList).find(f => f.name === fileInfo.name);
            if (file) {
                const store = useUploadStore.getState();
                store.uploadFile(file, fileInfo.id);
            }
        });
    },
    removeFile: (id) => {
        set((state) => ({
            files: state.files.filter(file => file.id !== id)
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
    uploadFile: async (file: File, id: number) => {
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