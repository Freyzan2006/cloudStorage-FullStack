"use client"

import { UploadedButton } from "@/features/upload/UploadedButton";
import { Card, CardBody, CardHeader, Divider, Button, Tabs, Tab, Spinner, Image } from "@heroui/react";
import { useFilesStore } from "@/features/upload/store/files.store";
import { useEffect } from "react";
import { Key } from "react";
import { FileType } from "@/features/upload/store/files.store";
import EnvironmentConfig from "@/config/config";

export const Dashboard = () => {
    const { files, isLoading, error, selectedType, setSelectedType, refreshFiles } = useFilesStore();

    useEffect(() => {
        refreshFiles();
    }, []);

    const handleTabChange = (key: Key) => {
        setSelectedType(key as FileType);
    };

    const formatFileSize = (bytes: number) => {
        const mb = bytes / 1024 / 1024;
        return `${mb.toFixed(2)} MB`;
    };

    const isImageFile = (mimetype: string) => {
        return mimetype.startsWith('image/');
    };

    const getFileUrl = (filename: string) => {
        return EnvironmentConfig.getFileUrl(filename);
    };

    const renderFileItem = (file: any) => {
        const isImage = isImageFile(file.mimetype);

        return (
            <div 
                key={file.id}
                className={`flex gap-4 p-3 rounded-lg hover:bg-content4 transition-colors ${
                    file.deletedAt ? 'bg-danger/10' : 'bg-content3'
                }`}
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
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-md flex items-center justify-center">
                            <a 
                                href={getFileUrl(file.filename)} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-white hover:underline"
                            >
                                Открыть
                            </a>
                        </div>
                    </div>
                )}
                <div className="flex flex-col justify-between flex-grow">
                    <div>
                        <span className="font-medium text-foreground">
                            {file.originalName}
                        </span>
                        <div className="flex justify-between items-center text-sm text-foreground-500 mt-1">
                            <span>{formatFileSize(file.size)}</span>
                            <span>{file.mimetype}</span>
                        </div>
                        {file.deletedAt && (
                            <span className="text-danger text-sm mt-1">
                                Удален: {new Date(file.deletedAt).toLocaleDateString()}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <section className="flex justify-center items-center flex-col lg:flex-row gap-6 p-4 min-h-[calc(100vh-4rem)] w-full max-w-[2400px] mx-auto">
            {/* Левая колонка - Навигация по файлам */}
            <Card className="w-full min-w-[350px] lg:w-[500px] xl:w-[600px] 2xl:w-[800px] h-[800px]">
                <CardHeader className="flex justify-between items-center px-6 py-4">
                    <h3 className="text-xl font-semibold text-foreground">Файлы</h3>
                    <Button 
                        size="md" 
                        color="primary" 
                        variant="flat"
                        className="px-4"
                        onPress={refreshFiles}
                        isLoading={isLoading}
                    >
                        Обновить
                    </Button>
                </CardHeader>
                <Divider/>
                <div className="px-2">
                    <Tabs 
                        aria-label="Типы файлов" 
                        color="primary" 
                        variant="underlined"
                        selectedKey={selectedType}
                        onSelectionChange={handleTabChange}
                        classNames={{
                            tabList: "gap-6",
                            cursor: "w-full",
                            tab: "max-w-fit px-2 h-12",
                        }}
                    >
                        <Tab
                            key="all"
                            title={
                                <div className="flex items-center gap-2">
                                    <span className="text-base">Все</span>
                                </div>
                            }
                        />
                        <Tab
                            key="files"
                            title={
                                <div className="flex items-center gap-2">
                                    <span className="text-base">Файлы</span>
                                </div>
                            }
                        />
                        <Tab
                            key="photos"
                            title={
                                <div className="flex items-center gap-2">
                                    <span className="text-base">Фото</span>
                                </div>
                            }
                        />
                        <Tab
                            key="trash"
                            title={
                                <div className="flex items-center gap-2">
                                    <span className="text-base">Корзина</span>
                                </div>
                            }
                        />
                    </Tabs>
                </div>
                <CardBody className="p-6 h-[calc(100%-140px)] overflow-y-auto">
                    {error ? (
                        <div className="text-danger text-base">
                            {error}
                        </div>
                    ) : isLoading ? (
                        <div className="flex justify-center items-center h-full">
                            <Spinner size="lg" />
                        </div>
                    ) : files.length === 0 ? (
                        <div className="text-foreground-500 text-base">
                            Список файлов пуст
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {files.map(renderFileItem)}
                        </div>
                    )}
                </CardBody>
            </Card>

            {/* Правая колонка - Область загрузки */}
            <Card className="w-full min-w-[300px] lg:w-[700px] xl:w-[800px] 2xl:w-[1000px] h-[800px]">
                <CardHeader className="px-6 py-4 flex justify-between items-center flex-col">
                    <h3 className="text-2xl font-semibold text-foreground">Загрузка файлов</h3>
                    <p className="text-foreground-500 text-base mt-1">
                        Перетащите файлы сюда или выберите их на вашем устройстве
                    </p>
                </CardHeader>
                <Divider/>
                <CardBody className="p-8 h-[calc(100%-100px)] overflow-y-auto">
                   <UploadedButton/>
                </CardBody>
            </Card>
        </section>
    );
}


