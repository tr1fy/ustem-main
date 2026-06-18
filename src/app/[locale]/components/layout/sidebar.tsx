'use client';

import * as React from 'react';
import { useEffect, useRef } from 'react';

import { Layers, LayoutPanelLeft, Settings, User, X } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

import { cn } from '@/app/[locale]/lib/utils';

export interface NavButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ForwardRefExoticComponent<any>;
  href: string;
  name: string;
  active?: boolean;
}

const NavButton = React.forwardRef<HTMLButtonElement, NavButtonProps>(
  ({ className, icon: Icon, name, active, ...props }, ref) => {

    return (
      <button
        className={cn(
          'focus-visible:ring-ring group inline-flex h-12 items-center rounded-l-lg px-4 py-3 text-sm font-medium text-gray-400 ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
          {
            'hover:bg-accent hover:text-gray-200 group-hover:text-primary':
              !active,
            'bg-accent border-r-4 border-primary text-gray-200': active,
          },
          className
        )}
        ref={ref}
        {...props}
      >
        {Icon && (
          <Icon
            className={cn(
              'mr-3 h-7 w-5 text-gray-400 group-hover:text-primary',
              { '!text-primary': active }
            )}
          />
        )}
        <p>{name}</p>
      </button>
    );
  }
);

NavButton.displayName = 'NavButton';

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  close: () => void;
  isOpen: boolean;
}
export function Sidebar({ className, close, isOpen }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const sidebarRef = useRef<HTMLDivElement>(null);

  const pages = [
    { name: 'Dashboard', href: '/', icon: LayoutPanelLeft },
    { name: 'Profile', href: '/profile', icon: User },
    { name: 'Course', href: '/course', icon: Layers },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const handleClick = (route: string) => {
    router.push(route);
  };

  useEffect(() => {
    const handleOutSideClick = (event: MouseEvent) => {
      if (!sidebarRef.current?.contains(event.target as Node)) {
        close();
      }
    };

    if (isOpen) {
      window.addEventListener('mousedown', handleOutSideClick);
    }

    return () => {
      if (isOpen) {
        window.removeEventListener('mousedown', handleOutSideClick);
      }
    };
  }, [isOpen, sidebarRef]);

  return (
    <div ref={sidebarRef} className={cn('bg-[#282C38] pb-12', className)}>
      <div className="space-y-4 py-4">
        <div className="py-2">
          <div className="mb-8 flex justify-between px-8">
            <X
              className="block h-8 w-8 text-gray-400 lg:hidden"
              onClick={close}
            />
            <h2 className="text-lg font-semibold tracking-tight">FIRST</h2>
          </div>
          <div className="flex flex-col space-y-2 pl-3">
            {pages.map((item) => (
              <NavButton
                key={item.name}
                name={item.name}
                icon={item.icon}
                href={item.href}
                active={pathname === item.href}
                onClick={() => handleClick(item.href)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
