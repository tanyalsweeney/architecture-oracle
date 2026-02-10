"use client";

import { useMemo, useState } from "react";


type ArchitectureResponse = {
  input: {
    description: string;
    constraints?: {
      budget?: string;
      timeline?: string;
      scale?: string;
    };
    preferences?: {
      stack?: string[];
      hosting?: string;
    };
  };
  signals: Record<string, boolean>;
  agents: {
    name: string;
    role: string;
    focus: string;
    recommendation: string;
    risks: string[];
  }[];
  decision: {
    architecture: string;
    rationale: string;
    components: {
      clients: string;
      backend: string;
      data: string[];
      infra: string;
      security: string;
    };
    risks: string[];
    nextSteps: string[];
  };
};

export default function ArchitectureAdvisor() {
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [timeline, setTimeline] = useState("");
  const [scale, setScale] = useState("");
  const [stack, setStack] = useState("");
  const [hosting, setHosting] = useState("");
  const [result, setResult] = useState<ArchitectureResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const signalList = useMemo(() => {
    if (!result) return [] as string[];
    return Object.entries(result.signals)
      .filter(([, value]) => value)
      .map(([key]) => key.replace(/([A-Z])/g, " $1"));
  }, [result]);

  const submit = async () => {
    if (!description.trim()) {
      setError("Please describe the app idea first.");
      return;
    }

    setLoading(true);
    setError(null);

    const payload = {
      description: description.trim(),
      constraints: {
        budget: budget.trim() || undefined,
        timeline: timeline.trim() || undefined,
        scale: scale.trim() || undefined
      },
      preferences: {
        stack: stack
          .split(",")
          .map((value) => value.trim())
          .filter(Boolean),
        hosting: hosting.trim() || undefined
      }
    };

    try {
      const res = await fetch("/api/architecture", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error(`Request failed with ${res.status}`);
      }

      const json = (await res.json()) as ArchitectureResponse;
      setResult(json);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="advisor">
      <header>
        <p className="eyebrow">Architecture Oracle</p>
        <h2>Ask the agent council</h2>
        <p>Describe the product and the team will debate the best architecture.</p>
      </header>

      <div className="advisor-form">
        <label className="field">
          App description
          <textarea
            placeholder="Example: A multi-tenant SaaS for HR teams with real-time reporting and AI insights"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={5}
          />
        </label>

        <div className="field-row">
          <label className="field">
            Budget
            <input
              type="text"
              placeholder="e.g. $50k"
              value={budget}
              onChange={(event) => setBudget(event.target.value)}
            />
          </label>
          <label className="field">
            Timeline
            <input
              type="text"
              placeholder="e.g. 3 months"
              value={timeline}
              onChange={(event) => setTimeline(event.target.value)}
            />
          </label>
          <label className="field">
            Scale
            <input
              type="text"
              placeholder="e.g. 1M users"
              value={scale}
              onChange={(event) => setScale(event.target.value)}
            />
          </label>
        </div>

        <div className="field-row">
          <label className="field">
            Preferred stack (comma separated)
            <input
              type="text"
              placeholder="Next.js, Postgres, Redis"
              value={stack}
              onChange={(event) => setStack(event.target.value)}
            />
          </label>
          <label className="field">
            Hosting preference
            <input
              type="text"
              placeholder="Vercel, AWS, Azure"
              value={hosting}
              onChange={(event) => setHosting(event.target.value)}
            />
          </label>
        </div>

        <button className="cta primary" type="button" onClick={submit} disabled={loading}>
          {loading ? "Consulting agents..." : "Get architecture"}
        </button>

        {error ? <p className="error">{error}</p> : null}
      </div>

      {result ? (
        <div className="advisor-output">
          <section className="decision">
            <h3>Decision</h3>
            <p className="decision-title">{result.decision.architecture}</p>
            <p>{result.decision.rationale}</p>
            <div className="decision-grid">
              <div>
                <p className="eyebrow">Clients</p>
                <p>{result.decision.components.clients}</p>
              </div>
              <div>
                <p className="eyebrow">Backend</p>
                <p>{result.decision.components.backend}</p>
              </div>
              <div>
                <p className="eyebrow">Data</p>
                <ul>
                  {result.decision.components.data.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="eyebrow">Infra</p>
                <p>{result.decision.components.infra}</p>
              </div>
              <div>
                <p className="eyebrow">Security</p>
                <p>{result.decision.components.security}</p>
              </div>
            </div>
          </section>

          <section>
            <h3>Signals detected</h3>
            <div className="chips">
              {signalList.length ? (
                signalList.map((signal) => (
                  <span key={signal} className="chip">
                    {signal}
                  </span>
                ))
              ) : (
                <span className="chip">No strong signals</span>
              )}
            </div>
          </section>

          <section>
            <h3>Agent debate</h3>
            <div className="agent-grid">
              {result.agents.map((agent) => (
                <article key={agent.name} className="agent-card">
                  <p className="eyebrow">{agent.role}</p>
                  <h4>{agent.name}</h4>
                  <p>{agent.focus}</p>
                  <p className="agent-recommendation">{agent.recommendation}</p>
                  {agent.risks.length ? (
                    <ul>
                      {agent.risks.map((risk) => (
                        <li key={risk}>{risk}</li>
                      ))}
                    </ul>
                  ) : null}
                </article>
              ))}
            </div>
          </section>

          <section>
            <h3>Next steps</h3>
            <ol>
              {result.decision.nextSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </section>
        </div>
      ) : null}
    </section>
  );
}