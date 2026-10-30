# Data Model: Fake Payment & Subscription Upgrade

**Feature**: `004-fake-payment-subscription`  
**Date**: 2026-10-30

## Entities

### Household (Updated)

```typescript
export interface Household {
  id: string;
  name: string;
  invite_code: string;
  plan: 'free' | 'premium';
  billing_cycle?: 'monthly' | 'yearly';
  item_count?: number;
  members?: Array<{ id: string; name: string; email: string; role: string }>;
}
```

### Fake Payment Transaction (Client-Side Simulation)

```typescript
export interface FakePaymentForm {
  cardNumber: string;      // ex: '4242 4242 4242 4242'
  cardExpiry: string;      // ex: '12/28'
  cardCvc: string;         // ex: '123'
  cardholderName: string;  // ex: 'Léa Martin'
  billingCycle: 'monthly' | 'yearly';
  amount: number;          // 3.99 | 29.99
}
```
