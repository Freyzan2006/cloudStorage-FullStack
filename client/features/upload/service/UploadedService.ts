import { BaseService } from "@/common/services/BaseService";
import { IFileDTO } from "../dto/file.dto";
import axios from "@/config/axios";

type FileType = "all" | "photos" | "trash"


class UploadedService extends BaseService {
    public async getAll(type: FileType = "all") : Promise<IFileDTO[]> {
        return (await axios.get(this.fullUrlAPI(`?type=${type}`))).data;
    }

    public async remove(ids: number[]) : Promise<void> {
        return (await axios.delete(this.fullUrlAPI(`/?ids=${ids}}`))).data;
    }

    public async uploadFile(options: any) : Promise<void> {
        const { onSuccess, onError, file, onProgress } = options;

        const formData = new FormData();
        formData.append("file", file);

        const config = {
            headers: {
                "Content-Type": "multipart/form-data",
            },
            onProgress: (e: ProgressEvent) => {
                onProgress({ percent: ((e.loaded * 100) / e.total) * 100 });
            }
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

export const uploadedService = new UploadedService("/files")