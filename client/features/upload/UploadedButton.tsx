"use client"

import { Button } from "@heroui/button"
import { Card, CardBody, CardHeader, Divider, Progress } from "@heroui/react"
import { useCallback, useRef } from "react"
import { useUploadStore } from "./store/upload.store"

export const UploadedButton = () => {
    const { 
        files, 
        isDragging, 
        setIsDragging, 
        addFiles, 
        removeFile,
        clearUploadedFiles 
    } = useUploadStore();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, [setIsDragging]);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, [setIsDragging]);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const { files } = e.dataTransfer;
        if (files && files.length > 0) {
            addFiles(files);
        }
    }, [setIsDragging, addFiles]);

    const handleFileSelect = useCallback(() => {
        fileInputRef.current?.click();
    }, []);

    const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { files } = e.target;
        if (files && files.length > 0) {
            addFiles(files);
            // Очищаем input, чтобы можно было загрузить тот же файл повторно
            e.target.value = '';
        }
    }, [addFiles]);

    const getStatusColor = (status?: string) => {
        switch (status) {
            case 'done':
                return 'success';
            case 'error':
                return 'danger';
            default:
                return 'primary';
        }
    };

    return (
        <div className="h-full flex flex-col gap-6">
            {/* Скрытый input для выбора файлов */}
            <input 
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileInput}
                multiple
            />

            {/* Область для дропзоны */}
            <div 
                className={`flex-1 border-3 border-dashed rounded-2xl flex items-center justify-center min-h-[300px] transition-colors
                    ${isDragging 
                        ? 'border-primary bg-primary/10' 
                        : 'border-divider hover:border-primary hover:bg-primary/5'
                    }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <div className="text-center p-8">
                    <p className="text-foreground-500 text-lg mb-6">
                        {isDragging ? 'Отпустите файлы здесь' : 'Перетащите файлы сюда'}
                    </p>
                    <Button 
                        color="primary"
                        size="lg"
                        className="px-8"
                        onPress={handleFileSelect}
                    >
                        Выбрать файлы
                    </Button>
                </div>
            </div>
            
            {/* Область для списка загруженных файлов */}
            <Card className="bg-content2">
                <CardHeader className="px-6 py-3 flex justify-between items-center">
                    <h4 className="text-base font-medium text-foreground">
                        Загруженные файлы
                    </h4>
                    {files.length > 0 && (
                        <Button
                            color="danger"
                            variant="light"
                            size="sm"
                            onPress={clearUploadedFiles}
                        >
                            Очистить список
                        </Button>
                    )}
                </CardHeader>
                <Divider/>
                <CardBody className="p-6">
                    {files.length === 0 ? (
                        <div className="text-foreground-500 text-base">
                            Нет загруженных файлов
                        </div>
                    ) : (
                        <div className="flex flex-col gap-2">
                            {files.map(file => (
                                <div 
                                    key={file.id} 
                                    className="flex flex-col gap-2 p-3 bg-content3 rounded-lg"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <span className="text-foreground font-medium">{file.name}</span>
                                            <span className="text-foreground-500 text-sm">
                                                {(file.size / 1024 / 1024).toFixed(2)} MB
                                            </span>
                                            {file.error && (
                                                <span className="text-danger text-sm">
                                                    {file.error}
                                                </span>
                                            )}
                                        </div>
                                        <Button
                                            color="danger"
                                            variant="light"
                                            size="sm"
                                            onPress={() => removeFile(file.id)}
                                            isDisabled={file.status === 'uploading'}
                                        >
                                            Удалить
                                        </Button>
                                    </div>
                                    {file.status === 'uploading' && (
                                        <Progress 
                                            value={file.progress} 
                                            color={getStatusColor(file.status)}
                                            size="sm"
                                            className="w-full"
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </CardBody>
            </Card>
        </div>
    );
}
