import Spinner from './Spinner';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  isLoading: boolean;
  loadingText: string;
}

export default function Button(props: ButtonProps) {
  const LoadingText = (
    <>
      <Spinner color="white" />
      <div aria-live="polite">{props.loadingText}</div>
    </>
  );

  return (
    <button {...props}>{props.isLoading ? LoadingText : props.children}</button>
  );
}
