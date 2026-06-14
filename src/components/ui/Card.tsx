import React from 'react';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Card({ title, children, className = '' }: CardProps) {
  return (
    <div className={`p-6 rounded-lg border border-gray-200 dark:border-gray-800 bg-background ${className}`}>
      {title && (
        <h3 className="text-xl font-semibold mb-4 text-foreground">{title}</h3>
      )}
      {children}
    </div>
  );
}
