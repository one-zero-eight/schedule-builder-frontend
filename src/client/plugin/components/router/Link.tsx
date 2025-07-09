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
  const { navigate } = useRouter();

  return (
    <a
      className={`cursor-pointer ${className || ''}`}
      onClick={() => navigate(href)}
      {...props}
    >
      {children}
    </a>
  );
}
