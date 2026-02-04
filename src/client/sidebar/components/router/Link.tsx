import { clsx } from 'clsx';
import { RouteLink } from '../../../lib/types';
import useRouter from '../../hooks/useRouter';

interface LinkProps
  extends Omit<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    'href' | 'onClick'
  > {
  children: React.ReactNode;
  href: RouteLink;
}

export default function Link({
  children,
  href,
  className,
  ...props
}: LinkProps) {
  const { navigate, location } = useRouter();
  const isActive = location === href;

  return (
    <a
      className={clsx(
        'text-primary flex flex-col justify-center border py-1 px-2 rounded-md hover:text-secondary',
        isActive && 'font-bold',
        className
      )}
      onClick={() => navigate(href)}
      {...props}
    >
      {children}
    </a>
  );
}
