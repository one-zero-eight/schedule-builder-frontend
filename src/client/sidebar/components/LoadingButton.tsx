import { PropsWithChildren } from 'react';
import { Spinner } from './Spinner';

export function LoadingButton({
  isLoading,
  loadingText,
  children,
  ...props
}: PropsWithChildren<
  {
    isLoading: boolean;
    loadingText: string;
  } & React.ButtonHTMLAttributes<HTMLButtonElement>
>) {
  return (
    <button {...props}>
      {isLoading ? (
        <>
          <Spinner className="text-white" />
          <div aria-live="polite">{loadingText}</div>
        </>
      ) : (
        children
      )}
    </button>
  );
}
