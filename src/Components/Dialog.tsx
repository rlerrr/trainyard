import React from "react";
import styles from "./Dialog.module.scss";

export function Header({ children }: { children: React.ReactNode }) {
    return <div className={styles.header}>{children}</div>;
}

export function Footer({ children, ...props }: React.HTMLAttributes<HTMLElement>) {
    return <div {...props} className={styles.footer}>{children}</div>;
}

export function Row({ children }: { children: React.ReactNode }) {
    return <div className={styles.row}>{children}</div>;
}

export default function Dialog({ children }: { children: React.ReactNode }) {
    return <div className={styles.wrapper}>{children}</div>;
}