interface ErrorTextProps {
  children: React.ReactNode;
}

export default function ErrorText({ children }: ErrorTextProps) {
  if (!children) return null;

  return <p className="text-red-500">Error: {children}</p>;
}
