import type { Response } from 'express';

export const ok = <T>(res: Response, body: T): Response => res.status(200).json(body);

export const created = <T>(res: Response, body: T): Response => res.status(201).json(body);
