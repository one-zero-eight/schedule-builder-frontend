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
      className={`flex flex-col justify-center border py-1 px-2 rounded-md cursor-pointer ${
        isActive ? 'font-bold' : ''
      } ${className || ''}`}
      onClick={() => navigate(href)}
      {...props}
    >
      {children}
    </a>
  );
}
