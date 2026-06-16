'use client';

import React, { useState } from 'react';

interface CopyButtonProps {
  text: string;
}

export default function CopyButton({ text }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="text-black bg-[#d4af37] hover:bg-[#c29e2f] px-3.5 py-1.5 rounded text-[10px] font-mono font-semibold transition-all shrink-0 uppercase tracking-wider active:scale-95"
    >
      {copied ? 'COPIED' : 'COPY'}
    </button>
  );
}
