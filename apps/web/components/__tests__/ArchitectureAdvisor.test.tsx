import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ArchitectureAdvisor from "../ArchitectureAdvisor";

type MockArchitectureResponse = {
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

const mockResponse: MockArchitectureResponse = {
  input: {
    description: "AI-powered logistics platform",
    constraints: {
      budget: "$100k",
      timeline: "6 months",
      scale: "100k users"
    },
    preferences: {
      stack: ["Next.js", "Postgres"],
      hosting: "Vercel"
    }
  },
  signals: {
    multiTenant: true,
    realtime: false
  },
  agents: [
    {
      name: "Ada",
      role: "Platform architect",
      focus: "Core platform",
      recommendation: "Adopt a modular monolith with strong domain boundaries.",
      risks: ["Domain drift"]
    }
  ],
  decision: {
    architecture: "Modular monolith with event-driven extensions",
    rationale: "Balances delivery speed with clear boundaries.",
    components: {
      clients: "Next.js web, Expo mobile",
      backend: "Node.js with Fastify",
      data: ["Postgres", "Redis"],
      infra: "Vercel + AWS RDS",
      security: "OIDC with tenant-aware RBAC"
    },
    risks: ["Scale hot spots"],
    nextSteps: ["Define bounded contexts", "Prototype ingestion pipeline"]
  }
};

describe("ArchitectureAdvisor", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("shows a validation message when description is empty", async () => {
    render(<ArchitectureAdvisor />);

    await userEvent.click(screen.getByRole("button", { name: /get architecture/i }));

    expect(
      await screen.findByText("Please describe the app idea first.")
    ).toBeInTheDocument();
  });

  it("renders the response when the request succeeds", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponse
    });

    vi.stubGlobal("fetch", fetchMock);

    render(<ArchitectureAdvisor />);

    await userEvent.type(
      screen.getByPlaceholderText(/multi-tenant saas/i),
      mockResponse.input.description
    );

    await userEvent.click(screen.getByRole("button", { name: /get architecture/i }));

    expect(fetchMock).toHaveBeenCalledTimes(1);

    await waitFor(() => {
      expect(
        screen.getByText(mockResponse.decision.architecture)
      ).toBeInTheDocument();
    });

    expect(
      screen.getByText(mockResponse.decision.components.backend)
    ).toBeInTheDocument();
    expect(screen.getByText(/signals detected/i)).toBeInTheDocument();
  });
});
