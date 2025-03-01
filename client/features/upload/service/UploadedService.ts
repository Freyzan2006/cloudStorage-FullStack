import { IFileDTO } from "../dto/file.dto";

import { BaseService } from "@/common/services/BaseService";
import axios from "@/config/axios";
import EnvironmentConfig from "@/config/config";

export type FileType = "all" | "photos" | "trash" | "files";

export enum EFileType {
  ALL = "all",
  PHOTOS = "photos",
  TRASH = "trash",
  FILES = "files",
}

class UploadedService extends BaseService {
  public getFileUrl(filename: string): string {
    return EnvironmentConfig.getFileUrl(filename);
  }

  public async getAll(type: EFileType = EFileType.ALL): Promise<IFileDTO[]> {
    const url = this.fullUrlAPI(`?type=${type}`);

    const response = await axios.get(url);

    return response.data;
  }

  public async remove(ids: number[]): Promise<void> {
    return (await axios.delete(this.fullUrlAPI(`/?ids=${ids}`))).data;
  }

  public async permanentlyDelete(ids: number[]): Promise<void> {
    return (await axios.delete(this.fullUrlAPI(`/permanent?ids=${ids}`))).data;
  }

  public async restore(ids: number[]): Promise<void> {
    return (await axios.post(this.fullUrlAPI(`/restore?ids=${ids}`))).data;
  }

  public async uploadFile(options: any): Promise<void> {
    const { onSuccess, onError, file, onProgress } = options;

    const formData = new FormData();

    formData.append("file", file);

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onProgress: (e: ProgressEvent) => {
        onProgress({ percent: ((e.loaded * 100) / e.total) * 100 });
      },
    };

    try {
      const { data } = await axios.post(this.fullUrlAPI(""), formData, config);

      onSuccess(data);

      return data;
    } catch (error) {
      onError({ error });
    }
  }
}

export const uploadedService = new UploadedService("/files");
