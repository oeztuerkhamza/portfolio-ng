import type { NextFunction, Request, Response } from 'express';
import { db } from './db';

type Handler = (req: Request, res: Response) => Promise<unknown>;
/** Express 4 fängt keine Promise-Fehler — hier werden sie weitergereicht. */
export const h = (fn: Handler) => (req: Request, res: Response, next: NextFunction) => {
  fn(req, res).catch(next);
};

export const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function sqlOr503(res: Response) {
  const sql = db();
  if (!sql) res.status(503).json({ error: 'not_configured' });
  return sql;
}

export const str = (v: unknown, max: number): string | null => {
  if (typeof v !== 'string') return null;
  const s = v.trim();
  return s ? s.slice(0, max) : null;
};
