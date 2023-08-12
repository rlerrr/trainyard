import React from "react";
import styles from "./Button.module.scss";

type ButtonProps = {
    buttonColor?: "default" | "green" | "yellow" | "red" | "blue";
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({ children, className, buttonColor, ...props }: ButtonProps) {
    const buttonClassName = `${styles.button} ${styles[buttonColor ?? 'default'] ?? ''} ${className ?? ''}`;
    return <button {...props} className={buttonClassName}>{children}</button>;
}

export function ButtonColumn({ children }: { children: React.ReactNode }) {
    return <div className={styles.column}>{children}</div>;
}