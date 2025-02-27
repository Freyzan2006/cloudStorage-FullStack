"use client"

import { FilesList } from "./components/FilesList"
import { UploadedButton } from "./UploadedButton"

export const Dashboard = () => {
    return (
        <div className="container mx-auto p-6">
            <div className="grid grid-cols-1 md:grid-cols-[400px_1fr] gap-6">
                <div className="w-full">
                    <FilesList />
                </div>
                <div className="w-full">
                    <UploadedButton />
                </div>
            </div>
        </div>
    )
} 