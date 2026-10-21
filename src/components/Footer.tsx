import { site } from "@/data/site";
import { Container } from "./Container";

export function Footer() {
  return (
    <footer className="border-t border-border">
      <Container className="mono flex items-center justify-between gap-4 py-6 text-muted">
        <p>© 2026 {site.name}</p>
        <a href="#top" className="link-u transition-colors hover:text-fg">
          Back to top ↑
        </a>
      </Container>
    </footer>
  );
}
