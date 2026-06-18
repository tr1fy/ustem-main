import { Menu } from 'lucide-react';

export function Header({
  className,
  toggle,
}: {
  className?: string;
  toggle: () => void;
}) {
  return (
    <header className={className}>
      <nav className="border-gray-200 bg-white px-4 py-2.5 dark:bg-gray-800 lg:px-6">
        <Menu className="h-9 w-9" onClick={toggle} />
      </nav>
    </header>
  );
}
