import React, { PropsWithChildren } from "react";

export function Card({ children, className = "" }: PropsWithChildren<{ className?: string }>) {
    return (
        <div className={`rounded-2xl bg-card/40 shadow-sm border border-neutral-800 p-4 ${className}`}>
            {children}
        </div>
    );
}

export function CardHeader({ children, className = "" }: PropsWithChildren<{ className?: string }>) {
    return (
        <div className={`mb-3 flex items-center justify-between ${className}`}>
            {children}
        </div>
    );
}

export function CardTitle({ children, className = "" }: PropsWithChildren<{ className?: string }>) {
    return (
        <h3 className={`text-lg font-semibold leading-tight ${className}`}>{children}</h3>
    );
}

export function CardContent({ children, className = "" }: PropsWithChildren<{ className?: string }>) {
    return <div className={`text-sm text-gray-200 ${className}`}>{children}</div>;
}

export default Card;
