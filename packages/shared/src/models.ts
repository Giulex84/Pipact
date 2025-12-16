/**
 * PiPact shared data models.
 * Notes on Pi compliance:
 * - Agreements represent human intent only; there is no automated enforcement or escrow.
 * - Payment data is optional and represents manual confirmations initiated by people.
 */

export type AgreementStatus =
  | 'CREATED'
  | 'ACCEPTED'
  | 'DELIVERED'
  | 'PAID'
  | 'CLOSED_UNPAID'
  | 'ABANDONED';

export type ServiceCategory =
  | 'DIGITAL_SERVICES'
  | 'EDUCATION'
  | 'COACHING'
  | 'DESIGN'
  | 'SOFTWARE_DEVELOPMENT'
  | 'CONTENT'
  | 'LOCAL_HELP'
  | 'OTHER';

export interface UserProfile {
  id: string;
  displayName: string;
  country?: string;
  /**
   * Pi compliance: badges and profiles avoid subjective ratings.
   * Notes should stay factual and conservative.
   */
  about?: string;
}

export interface ServiceProfile {
  id: string;
  ownerId: string;
  categories: ServiceCategory[];
  title: string;
  shortNote?: string;
  preferredContact?: string;
  available: boolean;
  createdAt: string;
}

export interface AgreementParticipant {
  userId: string;
  profileId?: string;
  role: 'provider' | 'requester';
}

export interface Agreement {
  id: string;
  title: string;
  summary: string;
  category: ServiceCategory;
  participants: AgreementParticipant[];
  status: AgreementStatus;
  createdAt: string;
  updatedAt: string;
  deliveryDate?: string;
  payment?: PiPaymentRecord;
  /**
   * Human-confirmed checkpoints only; no automation of outcomes.
   */
  history: AgreementHistoryEntry[];
}

export interface AgreementHistoryEntry {
  at: string;
  by: string;
  action:
    | 'CREATE'
    | 'ACCEPT'
    | 'DELIVER'
    | 'CONFIRM_PAYMENT'
    | 'CLOSE_UNPAID'
    | 'ABANDON';
  note?: string;
}

export interface PiPaymentRecord {
  intentId: string;
  amountPi: number;
  currency: 'PI';
  status: 'PENDING_MANUAL' | 'DECLINED' | 'CONFIRMED';
  /**
   * Only set after manual confirmation by both sides.
   */
  confirmedAt?: string;
}

export type BadgeType =
  | 'ON_TIME_DELIVERIES'
  | 'RESPONSIVE_PARTNER'
  | 'FAIR_SETTLER'
  | 'COMPLETED_AGREEMENTS';

export interface Badge {
  id: string;
  ownerId: string;
  type: BadgeType;
  description: string;
  /**
   * Derived only from completed agreement events, never from subjective scores.
   */
  awardedAt: string;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
}
