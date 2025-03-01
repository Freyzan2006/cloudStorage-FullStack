import { create } from "zustand";

import { EFileType, uploadedService } from "../service/UploadedService";
import { IFileDTO } from "../dto/file.dto";

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
      throw error;
    }
  },

  permanentlyDeleteFiles: async (ids: number[]) => {
    const { selectedType } = get();

    // Проверяем, что мы находимся в корзине
    if (selectedType !== EFileType.TRASH) {
      throw new Error("Окончательное удаление возможно только из корзины");
    }

    try {
      await uploadedService.permanentlyDelete(ids);
      await get().fetchFiles();
    } catch (error) {
      throw error;
    }
  },

  restoreFiles: async (ids: number[]) => {
    const { selectedType } = get();

    // Проверяем, что мы находимся в корзине
    if (selectedType !== EFileType.TRASH) {
      throw new Error("Восстановление возможно только из корзины");
    }

    try {
      await uploadedService.restore(ids);
      await get().fetchFiles();
    } catch (error) {
      throw error;
    }
  },

  fetchFiles: async () => {
    const { selectedType } = get();

    set({ isLoading: true, error: null });

    try {
      const files = await uploadedService.getAll(selectedType);

      set({
        files,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Произошла ошибка при загрузке файлов",
        isLoading: false,
        files: [],
      });
    }
  },
}));
