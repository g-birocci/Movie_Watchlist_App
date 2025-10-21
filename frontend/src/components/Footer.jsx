export default function Footer() {
  return (
    <footer className="mt-8 border-t border-[color:var(--border)] py-4 text-center text-sm text-muted">
      © {new Date().getFullYear()} Movie Watchlist
    </footer>
  );
}