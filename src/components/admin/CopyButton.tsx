'use client';

import { useState } from 'react';

interface CopyButtonProps {
  text: string;
  onCopy?: () => void;
  successMessage?: string;
  className?: string;
  children?: React.ReactNode;
  variant?: 'icon' | 'text' | 'button';
  size?: 'sm' | 'md' | 'lg';
}

export default function CopyButton({
  text,
  onCopy,
  successMessage = 'Copié !',
  className = '',
  children,
  variant = 'icon',
  size = 'md'
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCopy = async () => {
    if (loading) return;

    setLoading(true);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      onCopy?.();
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    } finally {
      setLoading(false);
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'text-xs px-2 py-1';
      case 'lg':
        return 'text-base px-4 py-2';
      default:
        return 'text-sm px-3 py-1.5';
    }
  };

  const baseClasses = 'transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500';

  if (variant === 'icon') {
    return (
      <button
        onClick={handleCopy}
        disabled={loading}
        className={`${baseClasses} text-gray-400 hover:text-gray-600 disabled:opacity-50 ${className}`}
        title={copied ? successMessage : 'Copier'}
      >
        {loading ? '⏳' : copied ? '✓' : '📋'}
      </button>
    );
  }

  if (variant === 'text') {
    return (
      <button
        onClick={handleCopy}
        disabled={loading}
        className={`${baseClasses} text-blue-600 hover:text-blue-800 disabled:opacity-50 ${className}`}
        title={copied ? successMessage : 'Copier'}
      >
        {loading ? '⏳ Copie...' : copied ? '✓ Copié' : children || 'Copier'}
      </button>
    );
  }

  return (
    <button
      onClick={handleCopy}
      disabled={loading}
      className={`${baseClasses} ${getSizeClasses()} bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 ${className}`}
    >
      {loading ? '⏳ Copie...' : copied ? `✓ ${successMessage}` : children || 'Copier'}
    </button>
  );
}