"use client";

import { Card, CardBody, CardHeader, Divider } from "@heroui/react";

import { UploadedButton } from "../UploadedButton";

export const UploadArea = () => {
  return (
    <Card className="w-full min-w-[300px] lg:w-[700px] xl:w-[800px] 2xl:w-[1000px] h-[800px]">
      <CardHeader className="px-6 py-4 flex justify-between items-center flex-col">
        <h3 className="text-2xl font-semibold text-foreground">
          Загрузка файлов
        </h3>
        <p className="text-foreground-500 text-base mt-1">
          Перетащите файлы сюда или выберите их на вашем устройстве
        </p>
      </CardHeader>
      <Divider />
      <CardBody className="p-8 h-[calc(100%-100px)] overflow-y-auto">
        <UploadedButton />
      </CardBody>
    </Card>
  );
};
