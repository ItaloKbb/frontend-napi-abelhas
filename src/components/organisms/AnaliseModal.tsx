"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/atoms";

interface AnaliseModalProps {
  open: boolean;
  title?: string;
  children: React.ReactNode;
  onClose: () => void;
  onConfirm?: () => void;
  confirmLabel?: string;
  loading?: boolean;
}

export function AnaliseModal({
  open,
  title = "Análise",
  children,
  onClose,
  onConfirm,
  confirmLabel = "Confirmar",
  loading = false,
}: AnaliseModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog ref={dialogRef} className="modal" onClose={onClose}>
      <div className="modal-box max-w-lg">
        <button className="btn btn-sm btn-circle btn-ghost absolute right-3 top-3" onClick={onClose}>✕</button>
        <h3 className="font-bold text-lg">{title}</h3>
        <div className="mt-4">{children}</div>
        <div className="modal-action">
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Fechar
          </Button>
          {onConfirm && (
            <Button onClick={onConfirm} loading={loading}>
              {confirmLabel}
            </Button>
          )}
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>Fechar</button>
      </form>
    </dialog>
  );
}
