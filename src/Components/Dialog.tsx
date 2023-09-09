import React from "react";
import styles from "./Dialog.module.scss";

export function Header({ children }: { children: React.ReactNode }) {
    return <div className={styles.header}>{children}</div>;
}

export function Footer({ children, className, ...props }: React.HTMLAttributes<HTMLElement>) {
    return <div {...props} className={`${styles.footer} ${className ?? ''}`}>{children}</div>;
}

export function Row({ children, className }: { children: React.ReactNode, className?: string }) {
    return <div className={`${styles.row} ${className ?? ''}`}>{children}</div>;
}

export default function Dialog({ children, className }: { children: React.ReactNode, className?: string }) {
    return <div className={`${styles.wrapper} ${className ?? ''}`}>{children}</div>;
}

export function Modal({ children, className }: { children: React.ReactNode, className?: string }) {
    return <div className={`${styles.modal} ${className ?? ''}`}><Dialog>{children}</Dialog></div>;
}