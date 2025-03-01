"use client"

import { Image, Button } from "@heroui/react";
import { IFileDTO } from "../dto/file.dto";
import EnvironmentConfig from "@/config/config";
import { Share, Trash2, RotateCcw } from "lucide-react";
import { uploadedService } from "../service/UploadedService";
import { useState } from "react";
import { useFilesStore } from "../store/files.store";
import { EFileType } from "../service/UploadedService";

interface FileItemProps {
    file: IFileDTO;
    isSelected?: boolean;
    onSelect?: (file: IFileDTO) => void;
    onDelete?: () => void;
}

export const FileItem = ({ file, isSelected, onSelect, onDelete }: FileItemProps) => {
    const { selectedType, deleteFiles, permanentlyDeleteFiles, restoreFiles } = useFilesStore();
    const [isDeleting, setIsDeleting] = useState(false);
    const [isRestoring, setIsRestoring] = useState(false);

    const isImageFile = (mimetype: string) => {
        return mimetype.startsWith('image/');
    };

    const getFileUrl = (filename: string) => {
        return EnvironmentConfig.getFileUrl(filename);
    };

    const formatFileSize = (bytes: number) => {
        const mb = bytes / 1024 / 1024;
        return `${mb.toFixed(2)} MB`;
    };

    const handleDownload = async () => {
        try {
            const url = getFileUrl(file.filename);
            const response = await fetch(url);
            const blob = await response.blob();
            
            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = file.originalName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
        } catch (error) {
            console.error('Error downloading file:', error);
        }
    };

    const handleDelete = async () => {
        setIsDeleting(true);

        try {
            if (selectedType === EFileType.TRASH) {
                await permanentlyDeleteFiles([file.id]);
            } else {
                await deleteFiles([file.id]);
            }
            onDelete?.();
        } catch (error) {
            console.error('Error deleting file:', error);
            // Здесь можно добавить отображение ошибки пользователю
        } finally {
            setIsDeleting(false);
        }
    };

    const handleRestore = async () => {
        setIsRestoring(true);

        try {
            await restoreFiles([file.id]);
            onDelete?.(); // Используем тот же callback для обновления списка
        } catch (error) {
            console.error('Error restoring file:', error);
        } finally {
            setIsRestoring(false);
        }
    };

    const handleClick = () => {
        onSelect?.(file);
    };

    // const handleImageClick = async (e: React.MouseEvent) => {
    //     e.preventDefault();
    //     e.stopPropagation();
    //     await handleDownload();
    // };

    const isImage = isImageFile(file.mimetype);

    

    return (
        <div 
            className={`
                flex gap-4 p-3 rounded-lg transition-colors cursor-pointer selecto-target
                ${file.deletedAt ? 'bg-danger/10' : isSelected ? 'bg-primary/20' : 'bg-content3 hover:bg-content4'}
            `}
            onClick={handleClick}
            data-id={file.id}
        >
            {isImage && (
                <div className="w-[100px] h-[100px] flex-shrink-0 relative group">
                    <Image
                        src={getFileUrl(file.filename)}
                        alt={file.originalName}
                        classNames={{
                            wrapper: "w-full h-full",
                            img: "object-cover w-full h-full rounded-md"
                        }}
                    />
                </div>
            )}
            <div className="flex flex-col justify-between flex-grow">
                <div className="flex flex-col gap-2 items-start">
                    <span className="font-medium text-foreground">
                        {file.originalName}
                    </span>
                    <div className="flex gap-3 justify-between items-center text-sm text-foreground-500 mt-1">
                        <span>{formatFileSize(file.size)}</span>
                        <span>{file.mimetype}</span>
                    </div>
                    {file.deletedAt && (
                        <span className="text-danger text-sm mt-1">
                            Удален: {new Date(file.deletedAt).toLocaleDateString()} 
                        </span>
                    )}
                </div>
                <div className="flex gap-2 mt-2 flex-wrap">
                    {
                        selectedType !== EFileType.TRASH &&
                        <Button
                            size="sm"
                            variant="flat"
                            color="primary"
                            onPress={handleDownload}
                            startContent={<Share size={16} />}
                            className="hover:scale-105 transition-all duration-300"
                        >
                            Скачать
                        </Button>
                    }
                        
                    {selectedType === EFileType.TRASH && (
                        <Button
                            size="sm"
                            variant="flat"
                            color="success"
                            onPress={handleRestore}
                            startContent={<RotateCcw size={16} />}
                            className="hover:scale-105 transition-all duration-300"
                            isLoading={isRestoring}
                        >
                            Восстановить
                        </Button>
                    )}
                    <Button
                        size="sm"
                        variant="flat"
                        color="danger"
                        onPress={handleDelete}
                        startContent={<Trash2 size={16} />}
                        className="hover:scale-105 transition-all duration-300"
                        isLoading={isDeleting}
                    >
                        {selectedType === EFileType.TRASH ? 'Удалить навсегда' : 'Удалить'}
                    </Button>
                </div>
            </div>
        </div>
    );
}; 