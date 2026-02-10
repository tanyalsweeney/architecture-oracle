import type { Request, Response } from "express";

export function healthHandler(_req: Request, res: Response) {
  res.json({
    status: "ok",
    service: "api",
    timestamp: new Date().toISOString()
  });
}
