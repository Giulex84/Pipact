import { randomUUID } from "crypto";
import {
  type Agreement,
  type AgreementHistoryEntry,
  type AgreementParticipant,
  type Badge,
  type BadgeType,
  type ServiceCategory,
  type ServiceProfile,
  type UserProfile
} from "@pipact/shared";
import { ApiError } from "./errors";

export interface CreateServiceInput {
  title: string;
  categories: ServiceCategory[];
  shortNote?: string;
  preferredContact?: string;
  available?: boolean;
}

export interface CreateAgreementInput {
  title: string;
  summary: string;
  category: ServiceCategory;
  providerId: string;
  requesterId: string;
  deliveryDate?: string;
}

export interface TransitionContext {
  actorId: string;
  note?: string;
}

const users = new Map<string, UserProfile>();
const services: ServiceProfile[] = [];
const agreements: Agreement[] = [];
const badges = new Map<string, Badge>();

const nowIso = () => new Date().toISOString();

const seedUser: UserProfile = {
  id: "user-demo",
  displayName: "PiPact Pioneer",
  country: "US",
  about:
    "Demo profile for PiPact. Replace with authenticated users once auth is enabled."
};

const seedService: ServiceProfile = {
  id: "svc-demo",
  ownerId: seedUser.id,
  categories: ["SOFTWARE_DEVELOPMENT"],
  title: "Build and review Pi app flows",
  shortNote: "Lightweight technical review for early-stage Pi apps",
  available: true,
  createdAt: nowIso()
};

const seedAgreement: Agreement = {
  id: "agree-demo",
  title: "Pi app onboarding help",
  summary: "Guide a new Pioneer through Pi app architecture decisions",
  category: "EDUCATION",
  participants: [
    { userId: seedUser.id, role: "provider" },
    { userId: "user-requester", role: "requester" }
  ],
  status: "CREATED",
  createdAt: nowIso(),
  updatedAt: nowIso(),
  history: [
    {
      at: nowIso(),
      by: "user-requester",
      action: "CREATE",
      note: "Initial demo agreement"
    }
  ]
};

const ensureSeeded = () => {
  if (!users.size) {
    users.set(seedUser.id, seedUser);
    users.set("user-requester", {
      id: "user-requester",
      displayName: "Requester Zero"
    });
    services.push(seedService);
    agreements.push(seedAgreement);
    recomputeBadgesForUser(seedUser.id);
    recomputeBadgesForUser("user-requester");
  }
};

export const getCurrentUser = (): UserProfile => {
  ensureSeeded();
  return seedUser;
};

export const ensureUser = (profile: UserProfile): UserProfile => {
  users.set(profile.id, { ...profile });
  return users.get(profile.id)!;
};

export const touchUser = (
  userId: string,
  profile?: Partial<UserProfile>
): UserProfile => {
  ensureSeeded();
  const existing = users.get(userId);
  if (existing) {
    const updated = { ...existing, ...profile };
    users.set(userId, updated);
    return updated;
  }

  const placeholder: UserProfile = {
    id: userId,
    displayName: profile?.displayName ?? userId
  };
  users.set(userId, placeholder);
  return placeholder;
};

export const listServices = (): ServiceProfile[] => {
  ensureSeeded();
  return [...services];
};

export const createService = (
  ownerId: string,
  input: CreateServiceInput
): ServiceProfile => {
  ensureSeeded();
  if (!input.title?.trim()) {
    throw new ApiError(400, "invalid_request", "Service title is required");
  }
  if (!Array.isArray(input.categories) || input.categories.length === 0) {
    throw new ApiError(
      400,
      "invalid_request",
      "At least one service category is required"
    );
  }

  const service: ServiceProfile = {
    id: `svc-${randomUUID()}`,
    ownerId,
    categories: input.categories,
    title: input.title.trim(),
    shortNote: input.shortNote?.trim(),
    preferredContact: input.preferredContact?.trim(),
    available: input.available ?? true,
    createdAt: nowIso()
  };

  services.push(service);
  return service;
};

export const listAgreements = (): Agreement[] => {
  ensureSeeded();
  return [...agreements];
};

export const getAgreementById = (id: string): Agreement | undefined => {
  ensureSeeded();
  return agreements.find((agreement) => agreement.id === id);
};

export const createAgreement = (
  input: CreateAgreementInput,
  context: TransitionContext
): Agreement => {
  ensureSeeded();

  const { title, summary, category, providerId, requesterId, deliveryDate } =
    input;

  if (!title?.trim() || !summary?.trim()) {
    throw new ApiError(
      400,
      "invalid_request",
      "Agreement title and summary are required"
    );
  }
  if (!category) {
    throw new ApiError(
      400,
      "invalid_request",
      "Agreement category is required"
    );
  }

  const createdAt = nowIso();
  const participants: AgreementParticipant[] = [
    { userId: providerId, role: "provider" },
    { userId: requesterId, role: "requester" }
  ];

  const history: AgreementHistoryEntry[] = [
    {
      at: createdAt,
      by: context.actorId,
      action: "CREATE",
      note: context.note ?? "Agreement drafted"
    }
  ];

  participants.forEach((participant) => touchUser(participant.userId));

  const agreement: Agreement = {
    id: `agree-${randomUUID()}`,
    title: title.trim(),
    summary: summary.trim(),
    category,
    participants,
    status: "CREATED",
    createdAt,
    updatedAt: createdAt,
    deliveryDate,
    history
  };

  agreements.push(agreement);
  return agreement;
};

const assertAgreementCanTransition = (
  agreement: Agreement,
  expectedStatus: Agreement["status"],
  nextStatus: Agreement["status"]
) => {
  if (agreement.status !== expectedStatus) {
    throw new ApiError(
      409,
      "conflict",
      `Cannot transition agreement from ${agreement.status} to ${nextStatus}`
    );
  }
};

const pushHistory = (
  agreement: Agreement,
  entry: AgreementHistoryEntry
): Agreement => {
  agreement.history.push(entry);
  agreement.updatedAt = entry.at;
  return agreement;
};

// State transitions are explicit and linear to avoid ambiguous agreement flows.
// Valid paths supported here:
// CREATED -> ACCEPTED -> DELIVERED.
// Additional states (e.g., PAID) would be layered on top with explicit functions.
export const acceptAgreement = (
  agreement: Agreement,
  context: TransitionContext
): Agreement => {
  assertAgreementCanTransition(agreement, "CREATED", "ACCEPTED");

  const at = nowIso();
  agreement.status = "ACCEPTED";
  pushHistory(agreement, {
    at,
    by: context.actorId,
    action: "ACCEPT",
    note: context.note ?? "Agreement accepted manually"
  });

  recomputeBadgesForUser(context.actorId);
  return agreement;
};

export const markAgreementDelivered = (
  agreement: Agreement,
  context: TransitionContext
): Agreement => {
  assertAgreementCanTransition(agreement, "ACCEPTED", "DELIVERED");

  const at = nowIso();
  agreement.status = "DELIVERED";
  pushHistory(agreement, {
    at,
    by: context.actorId,
    action: "DELIVER",
    note: context.note ?? "Work delivered and acknowledged by humans"
  });

  agreement.participants.forEach((participant) =>
    recomputeBadgesForUser(participant.userId)
  );
  return agreement;
};

const recomputeBadgesForUser = (userId: string) => {
  ensureSeeded();
  const ownedAgreements = agreements.filter((agreement) =>
    agreement.participants.some((participant) => participant.userId === userId)
  );

  const hasAccepted = ownedAgreements.some((agreement) =>
    agreement.history.some(
      (entry) => entry.action === "ACCEPT" && entry.by === userId
    )
  );

  const deliveredCount = ownedAgreements.filter(
    (agreement) => agreement.status === "DELIVERED"
  ).length;

  const completedCount = ownedAgreements.filter((agreement) =>
    ["DELIVERED", "PAID", "CLOSED_UNPAID"].includes(agreement.status)
  ).length;

  const nextBadges: Record<BadgeType, Badge | undefined> = {
    ON_TIME_DELIVERIES:
      deliveredCount > 0
        ? {
            id: `badge-${userId}-on-time`,
            ownerId: userId,
            type: "ON_TIME_DELIVERIES",
            description:
              "Documented manual deliveries completed on agreements.",
            awardedAt: nowIso()
          }
        : undefined,
    RESPONSIVE_PARTNER: hasAccepted
      ? {
          id: `badge-${userId}-responsive`,
          ownerId: userId,
          type: "RESPONSIVE_PARTNER",
          description: "Responded to agreements without automated workflows.",
          awardedAt: nowIso()
        }
      : undefined,
    FAIR_SETTLER: undefined,
    COMPLETED_AGREEMENTS:
      completedCount > 0
        ? {
            id: `badge-${userId}-completed`,
            ownerId: userId,
            type: "COMPLETED_AGREEMENTS",
            description:
              "Participated in agreements that reached a manual conclusion.",
            awardedAt: nowIso()
          }
        : undefined
  };

  (Object.values(nextBadges).filter(Boolean) as Badge[]).forEach((badge) => {
    badges.set(badge.id, badge);
  });
};

export const listBadges = (userId: string): Badge[] => {
  ensureSeeded();
  recomputeBadgesForUser(userId);
  return [...badges.values()].filter((badge) => badge.ownerId === userId);
};
