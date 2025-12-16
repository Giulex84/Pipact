import express from "express";
import type { Agreement } from "@pipact/shared";

const app = express();
app.use(express.json());

app.get("/health", (_req, res) => {
  const example: Agreement = {
    id: "example",
    clientId: "client",
    workerId: "worker",
    amountPi: 1,
    status: "CREATED"
  };
  res.json({ ok: true, example });
});

app.listen(3001);
