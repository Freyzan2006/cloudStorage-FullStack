import { create } from 'zustand'
import { uploadedService } from '../service/UploadedService';
import { IFileDTO } from '../dto/file.dto';

export type FileType = "all" | "files" | "photos" | "trash";

interface IFilesStore {
    files: IFileDTO[];
    isLoading: boolean;
    error: string | null;
    selectedType: FileType;
    fetchFiles: () => Promise<void>;
    setSelectedType: (type: FileType) => void;
    refreshFiles: () => Promise<void>;
}

export const useFilesStore = create<IFilesStore>((set, get) => ({
    files: [],
    isLoading: false,
    error: null,
    selectedType: "all",

    setSelectedType: (type) => {
        set({ selectedType: type });
        get().fetchFiles();
    },

    refreshFiles: async () => {
        await get().fetchFiles();
    },

    fetchFiles: async () => {
        const { selectedType } = get();
        set({ isLoading: true, error: null });
        
        try {
            let files: IFileDTO[] = [];
            
            // Получаем файлы в зависимости от выбранного типа
            if (selectedType === "all") {
                files = await uploadedService.getAll("all");
            } else if (selectedType === "photos") {
                files = (await uploadedService.getAll("all")).filter(file => 
                    file.mimetype.startsWith('image/') && !file.deletedAt
                );
            } else if (selectedType === "files") {
                files = (await uploadedService.getAll("all")).filter(file => 
                    !file.mimetype.startsWith('image/') && !file.deletedAt
                );
            } else if (selectedType === "trash") {
                files = (await uploadedService.getAll("all")).filter(file => 
                    file.deletedAt !== null
                );
            }

            set({ files, isLoading: false });
        } catch (error) {
            set({ 
                error: error instanceof Error ? error.message : 'Произошла ошибка при загрузке файлов', 
                isLoading: false,
                files: []
            });
        }
    }
})); 