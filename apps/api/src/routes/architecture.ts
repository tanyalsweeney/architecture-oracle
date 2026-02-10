import type { Request, Response } from "express";
import { z } from "zod";

const requestSchema = z.object({
  description: z.string().min(10),
  constraints: z
    .object({
      budget: z.string().optional(),
      timeline: z.string().optional(),
      scale: z.string().optional()
    })
    .optional(),
  preferences: z
    .object({
      stack: z.array(z.string()).optional(),
      hosting: z.string().optional()
    })
    .optional()
});

type ArchitectureChoice = "modular-monolith" | "microservices";

const agentRoster = [
  { name: "Nova", role: "Platform Architect" },
  { name: "Sage", role: "Backend Specialist" },
  { name: "Lyra", role: "Frontend + Mobile Expert" },
  { name: "Atlas", role: "Data + AI Engineer" },
  { name: "Cipher", role: "Security + Compliance" }
];

const keywordGroups = {
  realtime: ["realtime", "real-time", "chat", "socket", "collaboration"],
  scale: ["millions", "high traffic", "global", "enterprise", "scale"],
  compliance: ["hipaa", "pci", "gdpr", "soc2", "compliance", "privacy"],
  offline: ["offline", "sync", "pwa", "edge"],
  dataHeavy: ["analytics", "ml", "ai", "recommendation", "reporting"],
  payments: ["payments", "billing", "subscription", "checkout"],
  mobile: ["mobile", "ios", "android"],
  web: ["web", "browser", "saas", "dashboard"],
  mvp: ["mvp", "prototype", "hackathon", "quick", "fast"],
  marketplace: ["marketplace", "multi-tenant", "multi tenant"],
  streaming: ["stream", "video", "audio", "live"],
  integration: ["integration", "erp", "crm", "sap", "salesforce"]
} as const;

function detectSignals(description: string) {
  const normalized = description.toLowerCase();
  const has = (keys: readonly string[]) =>
    keys.some((keyword) => normalized.includes(keyword));

  return {
    realtime: has(keywordGroups.realtime),
    scale: has(keywordGroups.scale),
    compliance: has(keywordGroups.compliance),
    offline: has(keywordGroups.offline),
    dataHeavy: has(keywordGroups.dataHeavy),
    payments: has(keywordGroups.payments),
    mobile: has(keywordGroups.mobile),
    web: has(keywordGroups.web),
    mvp: has(keywordGroups.mvp),
    marketplace: has(keywordGroups.marketplace),
    streaming: has(keywordGroups.streaming),
    integration: has(keywordGroups.integration)
  };
}

function pickArchitecture(signals: ReturnType<typeof detectSignals>): ArchitectureChoice {
  if (signals.scale || signals.compliance || signals.streaming || signals.marketplace) {
    return "microservices";
  }

  return "modular-monolith";
}

function chooseClients(signals: ReturnType<typeof detectSignals>) {
  if (signals.mobile && signals.web) {
    return "Next.js (web) + React Native (mobile)";
  }

  if (signals.mobile) {
    return "React Native (mobile)";
  }

  return "Next.js (web)";
}

function chooseData(signals: ReturnType<typeof detectSignals>) {
  const base = ["PostgreSQL"];
  if (signals.realtime || signals.scale) {
    base.push("Redis (cache + pub/sub)");
  }
  if (signals.dataHeavy) {
    base.push("Analytics warehouse (BigQuery/Snowflake)");
  }
  if (signals.streaming) {
    base.push("Object storage (S3/GCS) + CDN");
  }
  return base;
}

function buildAgentArguments(signals: ReturnType<typeof detectSignals>) {
  const architecture = pickArchitecture(signals);

  return agentRoster.map((agent) => {
    const commonRisks = [] as string[];

    if (signals.compliance) {
      commonRisks.push("Regulatory controls will slow delivery without early compliance planning.");
    }
    if (signals.realtime) {
      commonRisks.push("Realtime workloads require careful scaling of sockets and event pipelines.");
    }

    let focus = "";
    let recommendation = "";

    switch (agent.role) {
      case "Platform Architect":
        focus = "Focus on system boundaries, deployability, and operational risk.";
        recommendation =
          architecture === "microservices"
            ? "Adopt event-driven microservices with clear domain ownership."
            : "Use a modular monolith with strict domain boundaries and extraction paths.";
        break;
      case "Backend Specialist":
        focus = "Focus on API ergonomics, latency, and service reliability.";
        recommendation = signals.realtime
          ? "Use a Node.js API with WebSocket support and a message broker."
          : "Use a TypeScript API (Express/Fastify) with clean service modules.";
        break;
      case "Frontend + Mobile Expert":
        focus = "Focus on client delivery speed and shared UI patterns.";
        recommendation = signals.mobile
          ? "Share design tokens and API clients between web and mobile apps."
          : "Optimize the web app for SSR + edge caching where possible.";
        break;
      case "Data + AI Engineer":
        focus = "Focus on data flows, analytics, and ML readiness.";
        recommendation = signals.dataHeavy
          ? "Introduce event streams and a warehouse for analytics and ML pipelines."
          : "Keep a single relational datastore with clear reporting replicas.";
        break;
      case "Security + Compliance":
        focus = "Focus on identity, secrets, and compliance controls.";
        recommendation = signals.compliance
          ? "Plan for auditing, encryption at rest/in transit, and policy-driven access."
          : "Implement OAuth/OIDC with least-privilege access from day one.";
        break;
      default:
        break;
    }

    return {
      name: agent.name,
      role: agent.role,
      focus,
      recommendation,
      risks: commonRisks
    };
  });
}

function decide(signals: ReturnType<typeof detectSignals>) {
  const architecture = pickArchitecture(signals);
  const clients = chooseClients(signals);
  const data = chooseData(signals);

  const components = {
    clients,
    backend: "TypeScript API (Express or Fastify)",
    data,
    infra: signals.scale
      ? "Containerized services with autoscaling (Kubernetes or managed services)"
      : "Single-region container hosting with CI/CD",
    security: signals.compliance
      ? "OIDC, audit logging, encryption, policy enforcement"
      : "OIDC, rate limiting, and secret rotation"
  };

  const risks = [] as string[];
  if (signals.mvp) {
    risks.push("Fast timelines risk cutting observability and testing coverage.");
  }
  if (signals.realtime) {
    risks.push("Realtime performance depends on careful pub/sub and socket scaling.");
  }
  if (signals.integration) {
    risks.push("Third-party integration constraints can drive the data model.");
  }

  const rationale =
    architecture === "microservices"
      ? "Scale, compliance, or multi-tenant signals indicate service isolation and event-driven scaling."
      : "A modular monolith reduces overhead while preserving clear service boundaries for later extraction.";

  return {
    architecture,
    rationale,
    components,
    risks,
    nextSteps: [
      "Finalize domain boundaries and core user journeys.",
      "Define SLAs, latency targets, and data retention policies.",
      "Create an MVP delivery plan with clear iteration milestones."
    ]
  };
}

export function architectureHandler(req: Request, res: Response) {
  const parsed = requestSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      error: "Invalid request",
      details: parsed.error.flatten()
    });
    return;
  }

  const { description, constraints, preferences } = parsed.data;
  const signals = detectSignals(description);
  const agents = buildAgentArguments(signals);
  const decision = decide(signals);

  res.json({
    input: {
      description,
      constraints,
      preferences
    },
    signals,
    agents,
    decision
  });
}