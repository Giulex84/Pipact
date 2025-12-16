import cors from 'cors';
import express, { Request, Response } from 'express';
import { Agreement, AgreementStatus, PaginatedResult, ServiceCategory, ServiceProfile } from '@pipact/shared/src/models';

/**
 * Pi compliance guardrails:
 * - No escrow or automatic payments; endpoints only record human decisions.
 * - Manual Pi Network payment intents are only logged; confirmation is user-driven.
 * - No speculative language or promises of financial returns.
 */
const app = express();
app.use(cors());
app.use(express.json());

const categories: ServiceCategory[] = [
  'DIGITAL_SERVICES',
  'EDUCATION',
  'COACHING',
  'DESIGN',
  'SOFTWARE_DEVELOPMENT',
  'CONTENT',
  'LOCAL_HELP',
  'OTHER',
];

const serviceProfiles: ServiceProfile[] = [];
const agreements: Agreement[] = [];

app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'PiPact backend base ready' });
});

app.get('/categories', (_req: Request, res: Response<PaginatedResult<ServiceCategory>>) => {
  res.json({ items: categories, total: categories.length });
});

app.post('/profiles', (req: Request, res: Response<ServiceProfile>) => {
  const profile: ServiceProfile = {
    ...req.body,
    createdAt: new Date().toISOString(),
    available: req.body?.available ?? true,
  };
  serviceProfiles.push(profile);
  res.status(201).json(profile);
});

app.get('/profiles', (_req: Request, res: Response<PaginatedResult<ServiceProfile>>) => {
  res.json({ items: serviceProfiles, total: serviceProfiles.length });
});

app.post('/agreements', (req: Request, res: Response<Agreement>) => {
  const now = new Date().toISOString();
  const agreement: Agreement = {
    ...req.body,
    status: 'CREATED',
    createdAt: now,
    updatedAt: now,
    history: [
      {
        at: now,
        by: req.body.participants?.[0]?.userId ?? 'unknown',
        action: 'CREATE',
        note: 'Agreement drafted by initiator.',
      },
    ],
  };
  agreements.push(agreement);
  res.status(201).json(agreement);
});

app.post('/agreements/:id/status', (req: Request, res: Response<Agreement | { error: string }>) => {
  const target = agreements.find((a) => a.id === req.params.id);
  if (!target) {
    return res.status(404).json({ error: 'Agreement not found' });
  }

  const allowed: AgreementStatus[] = ['ACCEPTED', 'DELIVERED', 'PAID', 'CLOSED_UNPAID', 'ABANDONED'];
  const next: AgreementStatus = req.body.status;
  if (!allowed.includes(next)) {
    return res.status(400).json({ error: 'Unsupported status change' });
  }

  // Manual, human-driven status transitions only.
  const now = new Date().toISOString();
  target.status = next;
  target.updatedAt = now;
  target.history.push({
    at: now,
    by: req.body.by ?? 'unknown',
    action:
      next === 'ACCEPTED'
        ? 'ACCEPT'
        : next === 'DELIVERED'
        ? 'DELIVER'
        : next === 'PAID'
        ? 'CONFIRM_PAYMENT'
        : next === 'CLOSED_UNPAID'
        ? 'CLOSE_UNPAID'
        : 'ABANDON',
    note: req.body.note,
  });

  if (next === 'PAID' && target.payment) {
    target.payment.status = 'CONFIRMED';
    target.payment.confirmedAt = now;
  }

  res.json(target);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`PiPact backend listening on port ${PORT}`);
});
