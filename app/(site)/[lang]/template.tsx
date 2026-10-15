// Re-mounts on every navigation, so each page fades in like the old client router did.
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="fade-in">{children}</div>;
}
