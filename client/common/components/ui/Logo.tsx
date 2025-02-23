'use client'

import {Image} from "@heroui/image";

// import Image from "next/image"

export const Logo: React.FC = () => {
    return (
        <Image
            src="/logo.jpg"
            width={50}
            alt="logo cloud storage"
        />
    )
} 