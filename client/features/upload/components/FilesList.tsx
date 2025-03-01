"use client";

import {
  Card,
  CardBody,
  CardHeader,
  Divider,
  Button,
  Tabs,
  Tab,
  Spinner,
} from "@heroui/react";
import { useEffect, useState } from "react";
import { Key } from "react";
import Selecto from "react-selecto";
import { Download, Trash2, RotateCcw } from "lucide-react";

import { IFileDTO } from "../dto/file.dto";
import { useFilesStore } from "../store/files.store";
import { EFileType, uploadedService } from "../service/UploadedService";

import { FileItem } from "./FileItem";

export const FilesList = () => {
  const {
    files,
    isLoading,
    error,
    selectedType,
    setSelectedType,
    refreshFiles,
    deleteFiles,
    permanentlyDeleteFiles,
    restoreFiles,
  } = useFilesStore();
  const [selectedFiles, setSelectedFiles] = useState<IFileDTO[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  useEffect(() => {
    refreshFiles();
  }, []);

  const handleTabChange = (key: Key) => {
    setSelectedType(key as EFileType);
    setSelectedFiles([]); // Сбрасываем выделение при смене вкладки
  };

  const handleSelect = (file: IFileDTO) => {
    setSelectedFiles((prev) => {
      const isSelected = prev.some((f) => f.id === file.id);

      if (isSelected) {
        return prev.filter((f) => f.id !== file.id);
      } else {
        return [...prev, file];
      }
    });
  };

  const handleSelectoEnd = (e: any) => {
    const elements = e.selected as HTMLElement[];
    const selectedIds = elements.map((el) => Number(el.dataset.id));

    setSelectedFiles((prev) => {
      const newSelection = files.filter((file) =>
        selectedIds.includes(file.id),
      );

      if (
        e.inputEvent?.shiftKey ||
        e.inputEvent?.ctrlKey ||
        e.inputEvent?.metaKey
      ) {
        // Добавляем к существующему выделению
        const existingIds = prev.map((f) => f.id);
        const uniqueNewFiles = newSelection.filter(
          (file) => !existingIds.includes(file.id),
        );

        return [...prev, ...uniqueNewFiles];
      } else {
        // Заменяем выделение
        return newSelection;
      }
    });
  };

  const handleDownloadSelected = async () => {
    if (selectedFiles.length === 0) return;

    // Скачиваем все файлы по очереди
    for (const file of selectedFiles) {
      try {
        const url = uploadedService.getFileUrl(file.filename);
        const response = await fetch(url);
        const blob = await response.blob();

        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = blobUrl;
        link.download = file.originalName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
      } catch {}
    }
  };

  const handleRestoreSelected = async () => {
    if (selectedFiles.length === 0) return;

    try {
      setIsRestoring(true);
      const selectedIds = selectedFiles.map((file) => file.id);

      await restoreFiles(selectedIds);

      // Очищаем выделение и обновляем список файлов
      setSelectedFiles([]);
      await refreshFiles();
    } catch {
    } finally {
      setIsRestoring(false);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedFiles.length === 0) return;

    try {
      setIsDeleting(true);
      const selectedIds = selectedFiles.map((file) => file.id);

      if (selectedType === EFileType.TRASH) {
        // Если мы в корзине, удаляем файлы окончательно
        await permanentlyDeleteFiles(selectedIds);
      } else {
        // Иначе перемещаем в корзину
        await deleteFiles(selectedIds);
      }

      // Очищаем выделение и обновляем список файлов
      setSelectedFiles([]);
      await refreshFiles();
    } catch {
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="w-full lg:min-w-[450px] lg:w-[500px] xl:w-[600px] 2xl:w-[800px] h-[800px]">
      <CardHeader className="flex flex-col gap-4 px-6 py-4">
        <div className="flex justify-between items-center w-full">
          <h3 className="text-xl font-semibold text-foreground">
            {selectedType === EFileType.TRASH ? "Корзина" : "Файлы"}
          </h3>
          <Button
            className="px-4"
            color="primary"
            isLoading={isLoading}
            size="md"
            variant="flat"
            onPress={refreshFiles}
          >
            Обновить
          </Button>
        </div>
        {selectedFiles.length > 0 && (
          <div className="flex gap-2 w-full">
            {selectedType !== EFileType.TRASH && (
              <Button
                className="flex-1"
                color="primary"
                size="sm"
                startContent={<Download size={16} />}
                variant="flat"
                onPress={handleDownloadSelected}
              >
                Скачать{" "}
                {selectedFiles.length > 1 ? `(${selectedFiles.length})` : ""}
              </Button>
            )}
            {selectedType === EFileType.TRASH && (
              <Button
                className="flex-1"
                color="success"
                isDisabled={isRestoring}
                isLoading={isRestoring}
                size="sm"
                startContent={<RotateCcw size={16} />}
                variant="flat"
                onPress={handleRestoreSelected}
              >
                {isRestoring
                  ? "Восстановление..."
                  : `Восстановить (${selectedFiles.length})`}
              </Button>
            )}
            <Button
              className="flex-1"
              color="danger"
              isDisabled={isDeleting}
              isLoading={isDeleting}
              size="sm"
              startContent={<Trash2 size={16} />}
              variant="flat"
              onPress={handleDeleteSelected}
            >
              {isDeleting
                ? "Удаление..."
                : selectedType === EFileType.TRASH
                  ? `Удалить навсегда (${selectedFiles.length})`
                  : `Удалить (${selectedFiles.length})`}
            </Button>
          </div>
        )}
      </CardHeader>
      <Divider />
      <div className="px-2">
        <Tabs
          aria-label="Типы файлов"
          classNames={{
            tabList: "gap-6",
            cursor: "w-full",
            tab: "max-w-fit px-2 h-12",
          }}
          color="primary"
          selectedKey={selectedType}
          variant="underlined"
          onSelectionChange={handleTabChange}
        >
          <Tab
            key={EFileType.ALL}
            title={
              <div className="flex items-center gap-2">
                <span className="text-base">Все</span>
              </div>
            }
          />
          <Tab
            key={EFileType.FILES}
            title={
              <div className="flex items-center gap-2">
                <span className="text-base">Файлы</span>
              </div>
            }
          />
          <Tab
            key={EFileType.PHOTOS}
            title={
              <div className="flex items-center gap-2">
                <span className="text-base">Фото</span>
              </div>
            }
          />
          <Tab
            key={EFileType.TRASH}
            title={
              <div className="flex items-center gap-2">
                <span className="text-base">Корзина</span>
              </div>
            }
          />
        </Tabs>
      </div>
      <CardBody className="p-6 h-[calc(100%-140px)] overflow-y-auto relative">
        {error ? (
          <div className="text-danger text-base">{error}</div>
        ) : isLoading ? (
          <div className="flex justify-center items-center h-full">
            <Spinner size="lg" />
          </div>
        ) : files.length === 0 ? (
          <div className="text-foreground-500 text-base">
            {selectedType === EFileType.TRASH
              ? "Корзина пуста"
              : "Список файлов пуст"}
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-3">
              {files.map((file) => (
                <FileItem
                  key={file.id}
                  file={file}
                  isSelected={selectedFiles.some((f) => f.id === file.id)}
                  onDelete={refreshFiles}
                  onSelect={handleSelect}
                />
              ))}
            </div>
            <Selecto
              className="pointer-events-none"
              dragContainer={".overflow-y-auto"}
              hitRate={0}
              selectByClick={true}
              selectFromInside={true}
              selectableTargets={[".selecto-target"]}
              toggleContinueSelect={["shift", "ctrl", "meta"]}
              onSelectEnd={handleSelectoEnd}
            />
          </>
        )}
      </CardBody>
    </Card>
  );
};
