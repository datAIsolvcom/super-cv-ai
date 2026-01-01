"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface EditableFieldProps {
  value: string;
  onSave: (val: string) => void;
  className?: string;
  tagName?: "h1" | "h2" | "h3" | "p" | "span" | "div";
  placeholder?: string;
  style?: React.CSSProperties;
}

export function EditableField({ value, onSave, className, tagName = "div", placeholder }: EditableFieldProps) {
  const [content, setContent] = useState(value);
  const containerRef = useRef<HTMLElement>(null);

  
  useEffect(() => {
    if (value !== containerRef.current?.innerHTML) {
        setContent(value);
    }
  }, [value]);

  const handleBlur = (e: React.FocusEvent<HTMLElement>) => {
    const html = e.currentTarget.innerHTML;
    if (html !== value) {
        onSave(html); 
    }
  };

  const Tag = tagName as any;

  return (
    <Tag
      ref={containerRef}
      className={cn(
        "outline-none focus:bg-blue-50/50 focus:ring-1 focus:ring-blue-300 rounded px-1 transition-all min-w-[20px] empty:before:content-[attr(data-placeholder)] empty:before:text-slate-400 cursor-text hover:bg-slate-50",
        className
      )}
      contentEditable
      suppressContentEditableWarning={true}
      onBlur={handleBlur}
      dangerouslySetInnerHTML={{ __html: content }}
      data-placeholder={placeholder}
    />
  );
}