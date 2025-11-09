const AuthLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex h-full min-h-screen min-w-screen flex-col items-center justify-center">
    {children}
  </div>
);

export { AuthLayout };
