"use client";

import React, { useState } from 'react';
import Image from 'next/image';

export default function UserAvatar({ src, alt, className }) {
    const fallbackSrc = "https://images.remotehub.com/64bb220e8efc11ee9010427c1ea53fc9?w=160&h=160&fit=crop&p=top";
    
    
    const [imgSrc, setImgSrc] = useState(src || fallbackSrc);

    return (
        <div className={`relative overflow-hidden flex-shrink-0 ${className || 'w-6 h-6 rounded-full'}`}>
            <Image 
                src={imgSrc} 
                alt={alt || "User Avatar"} 
                fill
                sizes="24px"
                className="object-cover rounded-full"
                onError={() => {
                   
                    setImgSrc(fallbackSrc);
                }}
                unoptimized={true} 
            />
        </div>
    );
}