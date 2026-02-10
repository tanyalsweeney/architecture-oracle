import Link from "next/link";
import ArchitectureAdvisor from "../components/ArchitectureAdvisor";
import { getHealthStatus } from "../lib/health";

const cards = [
  {
    title: "API",
    body: "Explore the Express API and try the /health endpoint.",
    href: "http://localhost:4000/health"
  },
  {
    title: "Mobile",
    body: "Launch the Expo dev client to view the React Native experience.",
    href: "https://docs.expo.dev/"
  },
  {
    title: "Web",
    body: "You are already here—extend this page with live data soon.",
    href: "https://nextjs.org/docs"
  }
];

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const apiHealth = await getHealthStatus();

  return (
    <main className="hero">
      <ArchitectureAdvisor />
      <section className="secondary">
        <p className="eyebrow">Architecture Oracle</p>
        <h1>Full-stack starter</h1>
        <p>
          Next.js 14, Expo, and Express share a single pnpm workspace so you can
          deliver consistent product surfaces faster.
        </p>
        <div className="cta-row">
          <Link href="https://github.com/tanyaslweeney" className="cta primary">
            View Repo
          </Link>
          <Link href="/api/ping" className="cta ghost">
            Test Edge Route
          </Link>
        </div>
      </section>
      <section className="grid secondary-grid">
        <article>
          <p className="eyebrow">API status</p>
          {apiHealth ? (
            <p>
              {`${apiHealth.service} responded at ${new Date(apiHealth.timestamp).toLocaleTimeString()}`}
            </p>
          ) : (
            <p>Unable to reach the API just yet.</p>
          )}
        </article>
        {cards.map((card) => (
          <article key={card.title}>
            <p className="eyebrow">{card.title}</p>
            <p>{card.body}</p>
            <a href={card.href} target="_blank" rel="noreferrer">
              Learn more →
            </a>
          </article>
        ))}
      </section>
    </main>
  );
}
