'use client';

import { ReactNode } from 'react';

interface ModalProps {
  title?: string;
  children: ReactNode;
  onClose: () => void;
  primaryAction?: { label: string; onClick: () => void };
  secondaryAction?: { label: string; onClick: () => void };
}

export function Modal({
  title,
  children,
  onClose,
  primaryAction,
  secondaryAction,
}: ModalProps) {
  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="card p-6 w-full max-w-lg shadow-lg animate-scale-in">
        {title && <h2 className="text-lg font-semibold text-foreground mb-3">{title}</h2>}

        <div className="text-muted mb-4">{children}</div>

        <div className="flex justify-end gap-2 mt-4">
          {secondaryAction && (
            <button
              className="btn-muted"
              onClick={secondaryAction.onClick}
              type="button"
            >
              {secondaryAction.label}
            </button>
          )}
          {primaryAction && (
            <button
              className="btn-accent"
              onClick={primaryAction.onClick}
              type="button"
            >
              {primaryAction.label}
            </button>
          )}
          {!primaryAction && !secondaryAction && (
            <button className="btn-muted" onClick={onClose} type="button">
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
