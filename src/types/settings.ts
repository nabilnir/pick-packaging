export interface GeneralSettings {
  platformName: string;
  supportEmail: string;
  businessAddress: string;
  vatNumber?: string;
  defaultCurrency: string;
  timezone: string;
  dateFormat: string;
  logoUrl?: string;
}

export type AdminRole = 'Owner' | 'Admin' | 'Viewer';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  status: 'Active' | 'Pending invite';
  joined: string;
}

export interface InvitePayload {
  email: string;
  role: AdminRole;
}

export type NotificationEvent = 
  | 'New order placed' 
  | 'Order status changed' 
  | 'New vendor registered' 
  | 'Vendor verification requested' 
  | 'Customer account suspended' 
  | 'Low stock alert' 
  | 'Weekly summary digest' 
  | 'Security alert';

export type NotificationChannel = 'Email' | 'In-app';

export type NotificationMatrix = Record<NotificationEvent, Record<NotificationChannel, boolean>>;

export interface PaymentSettings {
  defaultCurrency: string;
  vatRate: number;
  pricesDisplay: 'Excluding VAT' | 'Including VAT';
}

export interface InvoiceSettings {
  invoicePrefix: string;
  invoiceNumberFormat: 'sequential' | 'date-prefixed';
  invoiceFooterNote: string;
  companyBankDetails: string;
}

export interface VendorPolicySettings {
  requireVerification: boolean;
  autoApproveDomains: boolean;
  allowedDomains: string;
  requiredDocuments: string[];
  defaultSlaHours: number;
  autoSuspendBreachRate: number;
  notifySlaDeadlineHours: number;
  allowedSectors: string[];
  onboardingMessage: string;
}

export type ApiKeyScope = 'Read orders' | 'Write orders' | 'Read customers' | 'Read analytics' | 'Manage vendors' | 'Webhooks';

export interface ApiKey {
  id: string;
  name: string;
  keyPreview: string;
  created: string;
  lastUsed: string | null;
  scopes: ApiKeyScope[];
}

export interface AuditLogEntry {
  id: string;
  actor: string;
  action: string;
  resource: string;
  ipAddress: string;
  timestamp: string;
}

export type WebhookEvent = 
  | 'orders.created' | 'orders.updated' | 'orders.cancelled' | 'orders.fulfilled'
  | 'customers.registered' | 'customers.suspended' | 'customers.reactivated'
  | 'vendors.registered' | 'vendors.verified' | 'vendors.suspended'
  | 'products.created' | 'products.updated' | 'products.out_of_stock';

export interface WebhookEndpoint {
  id: string;
  url: string;
  events: WebhookEvent[];
  status: 'Active' | 'Paused';
  lastTriggered: string | null;
  successRate: number;
  retryPolicy: '3 attempts' | '5 attempts' | 'No retry';
}

export interface DeliveryLog {
  id: string;
  endpointUrl: string;
  event: WebhookEvent;
  status: number;
  responseTimeMs: number;
  timestamp: string;
}

export interface WebhookSecret {
  endpointId: string;
  secret: string;
}
