import React, { useCallback, useRef } from "react";

export default function useTap(thresholdMs: number = 700) {
    const timer = useRef<NodeJS.Timeout | null>(null);

    return useCallback((e: React.MouseEvent, { onSingleTap, onDoubleTap }: { onSingleTap?: () => void; onDoubleTap?: () => void }) => {
        if (timer.current == null) {
            // First tap
            onSingleTap?.();

            timer.current = setTimeout(() => {
                timer.current = null;
            }, thresholdMs);
        } else {
            // Second tap
            onDoubleTap?.();

            clearTimeout(timer.current);
            timer.current = null;
        }
    }, [timer]);
}