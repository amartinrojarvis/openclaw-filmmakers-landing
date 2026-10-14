'use client';

import { useState } from 'react';

export function CopyPrompt({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      className="btn sm"
      type="button"
      onClick={() => {
        if (navigator.clipboard) void navigator.clipboard.writeText(text);
        setCopied(true);
      }}
    >
      {copied ? 'Copiado' : 'Copiar prompt'}
    </button>
  );
}
