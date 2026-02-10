import { describe, expect, it } from "vitest";
import type { Request, Response } from "express";
import { healthHandler } from "./health";
import { vi } from "vitest";

describe("healthHandler", () => {
  it("returns ok payload", () => {
    const json = vi.fn();
    const res = { json } as unknown as Response;

    healthHandler({} as Request, res);

    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({ status: "ok", service: "api" })
    );
  });
});
