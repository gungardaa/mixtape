'use client';

import type { ButtonHTMLAttributes, ComponentPropsWithoutRef, ReactNode } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'quiet';
  size?: 'sm' | 'md';
  children: ReactNode;
};

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  const base = 'inline-flex items-center justify-center border border-black font-semibold transition disabled:cursor-not-allowed disabled:opacity-45 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-black/20';
  const variants = {
    primary: 'bg-[#171717] text-[#fffdf7] shadow-[3px_3px_0_#171717] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_#171717] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none',
    secondary: 'bg-[#fffdf7] text-[#171717] shadow-[3px_3px_0_#171717] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_#171717] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none',
    quiet: 'bg-transparent text-[#5f6468] shadow-none hover:bg-[#171717] hover:text-[#fffdf7]',
  };
  const sizes = {
    sm: 'min-h-9 px-3 text-xs',
    md: 'min-h-11 px-5 text-sm',
  };

  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  );
}

export function PrimaryButton({ children, ...props }: ComponentPropsWithoutRef<'button'>) {
  return <Button variant="primary" {...props}>{children}</Button>;
}

export function SecondaryButton({ children, ...props }: ComponentPropsWithoutRef<'button'>) {
  return <Button variant="secondary" {...props}>{children}</Button>;
}
