"use client";

import type { ReactNode } from "react";
import { toast as sonnerToast } from "sonner";

type ToastVariant = "default" | "destructive";

type ToastOptions = {
    title?: ReactNode;
    description?: ReactNode;
    variant?: ToastVariant;
};

export const toast = ({ title, description, variant = "default" }: ToastOptions) => {
    const content = title ?? "";

    if (variant === "destructive") {
        return sonnerToast.error(content, { description });
    }

    return sonnerToast(content, { description });
};

export const useToast = () => ({
    toast,
});
