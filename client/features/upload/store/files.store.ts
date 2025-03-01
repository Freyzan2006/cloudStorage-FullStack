import { create } from 'zustand'
import { EFileType, uploadedService } from '../service/UploadedService';
import { IFileDTO } from '../dto/file.dto';

interface IFilesStore {
    files: IFileDTO[];
    isLoading: boolean;
    error: string | null;
    selectedType: EFileType;
    fetchFiles: () => Promise<void>;
    setSelectedType: (type: EFileType) => void;
    refreshFiles: () => Promise<void>;
    deleteFiles: (ids: number[]) => Promise<void>;
    permanentlyDeleteFiles: (ids: number[]) => Promise<void>;
    restoreFiles: (ids: number[]) => Promise<void>;
}

export const useFilesStore = create<IFilesStore>((set, get) => ({
    files: [],
    isLoading: false,
    error: null,
    selectedType: EFileType.ALL,

    setSelectedType: (type: EFileType) => {
        console.log('Setting selected type:', type);
        set({ selectedType: type });
        get().fetchFiles();
    },

    refreshFiles: async () => {
        await get().fetchFiles();
    },

    deleteFiles: async (ids: number[]) => {
        try {
            await uploadedService.remove(ids);
            await get().fetchFiles();
        } catch (error) {
            console.error('Error deleting files:', error);
            throw error;
        }
    },

    permanentlyDeleteFiles: async (ids: number[]) => {
        const { selectedType } = get();
        
        // Проверяем, что мы находимся в корзине
        if (selectedType !== EFileType.TRASH) {
            throw new Error('Окончательное удаление возможно только из корзины');
        }

        try {
            await uploadedService.permanentlyDelete(ids);
            await get().fetchFiles();
        } catch (error) {
            console.error('Error permanently deleting files:', error);
            throw error;
        }
    },

    restoreFiles: async (ids: number[]) => {
        const { selectedType } = get();
        
        // Проверяем, что мы находимся в корзине
        if (selectedType !== EFileType.TRASH) {
            throw new Error('Восстановление возможно только из корзины');
        }

        try {
            await uploadedService.restore(ids);
            await get().fetchFiles();
        } catch (error) {
            console.error('Error restoring files:', error);
            throw error;
        }
    },

    fetchFiles: async () => {
        const { selectedType } = get();
        console.log('Fetching files for type:', selectedType);
        set({ isLoading: true, error: null });
        
        try {
            const files = await uploadedService.getAll(selectedType);
            console.log('Received files:', files);
            
            set({ 
                files, 
                isLoading: false,
                error: null
            });
        } catch (error) {
            console.error('Error fetching files:', error);
            set({ 
                error: error instanceof Error ? error.message : 'Произошла ошибка при загрузке файлов', 
                isLoading: false,
                files: []
            });
        }
    }
})); 