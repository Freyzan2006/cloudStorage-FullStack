"use client"

import { FilesList } from "@/features/upload/components/FilesList";
import { UploadArea } from "@/features/upload/components/UploadArea";

export const Dashboard = () => {
    return (
        <section className="flex justify-center items-center flex-col lg:flex-row gap-6 p-4 min-h-[calc(100vh-4rem)] w-full max-w-[2400px] mx-auto">
            <FilesList />
            <UploadArea />
        </section>
    );
};


