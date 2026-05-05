import {
  GeneralSettings, AdminUser, NotificationMatrix, PaymentSettings,
  InvoiceSettings, VendorPolicySettings, ApiKey, AuditLogEntry,
  WebhookEndpoint, DeliveryLog
} from '@/types/settings';

export const mockGeneralSettings: GeneralSettings = {
  platformName: "PickPackaging Marketplace",
  supportEmail: "support@pickpackaging.com",
  businessAddress: "123 Logistics Drive\nCape Town, 8001\nSouth Africa",
  vatNumber: "ZA491203948",
  defaultCurrency: "ZAR",
  timezone: "Africa/Johannesburg",
  dateFormat: "DD/MM/YYYY"
};

export const mockTeam: AdminUser[] = [
  { id: "u_1", name: "Sarah Jenkins", email: "sarah@pickpackaging.com", role: "Owner", status: "Active", joined: "2023-01-15T08:00:00Z" },
  { id: "u_2", name: "David Osei", email: "david@pickpackaging.com", role: "Admin", status: "Active", joined: "2023-04-20T09:30:00Z" },
  { id: "u_3", name: "Lisa Wong", email: "lisa@pickpackaging.com", role: "Viewer", status: "Pending invite", joined: "2023-10-11T14:20:00Z" },
];

export const mockNotificationMatrix: NotificationMatrix = {
  'New order placed': { Email: true, 'In-app': true },
  'Order status changed': { Email: false, 'In-app': true },
  'New vendor registered': { Email: true, 'In-app': true },
  'Vendor verification requested': { Email: true, 'In-app': true },
  'Customer account suspended': { Email: true, 'In-app': true },
  'Low stock alert': { Email: false, 'In-app': true },
  'Weekly summary digest': { Email: true, 'In-app': false },
  'Security alert': { Email: true, 'In-app': true }
};

export const mockPaymentSettings: PaymentSettings = {
  defaultCurrency: "ZAR",
  vatRate: 15,
  pricesDisplay: "Excluding VAT"
};

export const mockInvoiceSettings: InvoiceSettings = {
  invoicePrefix: "PP-",
  invoiceNumberFormat: "sequential",
  invoiceFooterNote: "Thank you for doing business with PickPackaging.",
  companyBankDetails: "Bank: Standard Bank\nAccount: 1029384756\nBranch Code: 051001"
};

export const mockVendorPolicy: VendorPolicySettings = {
  requireVerification: true,
  autoApproveDomains: false,
  allowedDomains: "",
  requiredDocuments: ["Business registration", "Tax certificate", "Bank letter"],
  defaultSlaHours: 48,
  autoSuspendBreachRate: 20,
  notifySlaDeadlineHours: 6,
  allowedSectors: ["Food Service", "Industrial", "Agriculture"],
  onboardingMessage: "Welcome to PickPackaging!\n\nPlease ensure your catalog is up to date and your SLA response times are monitored."
};

export const mockApiKeys: ApiKey[] = [
  { id: "ak_1", name: "ERP Integration", keyPreview: "a8f9c2e1", created: "2023-08-10T10:00:00Z", lastUsed: "2023-11-05T12:00:00Z", scopes: ["Read orders", "Write orders"] },
  { id: "ak_2", name: "BI Dashboard", keyPreview: "d7b4e9f0", created: "2023-09-01T09:00:00Z", lastUsed: "2023-11-06T08:30:00Z", scopes: ["Read analytics", "Read customers"] }
];

export const mockAuditLogs: AuditLogEntry[] = [
  { id: "al_1", actor: "Sarah Jenkins", action: "Deleted API Key", resource: "ak_3", ipAddress: "192.168.1.1", timestamp: "2023-11-06T14:00:00Z" },
  { id: "al_2", actor: "David Osei", action: "Updated Vendor Policy", resource: "Vendor Settings", ipAddress: "10.0.0.5", timestamp: "2023-11-06T11:20:00Z" },
  { id: "al_3", actor: "System", action: "Auto-suspended Vendor", resource: "ClearPack Solutions", ipAddress: "127.0.0.1", timestamp: "2023-11-05T02:00:00Z" }
];

export const mockWebhooks: WebhookEndpoint[] = [
  { id: "wh_1", url: "https://erp.example.com/webhooks/orders", events: ["orders.created", "orders.fulfilled"], status: "Active", lastTriggered: "2023-11-06T15:30:00Z", successRate: 99.8, retryPolicy: "5 attempts" },
  { id: "wh_2", url: "https://crm.example.com/api/vendors", events: ["vendors.registered", "vendors.verified"], status: "Paused", lastTriggered: "2023-10-20T10:00:00Z", successRate: 85.4, retryPolicy: "3 attempts" }
];

export const mockDeliveryLogs: DeliveryLog[] = [
  { id: "dl_1", endpointUrl: "https://erp.example.com/webhooks/orders", event: "orders.created", status: 200, responseTimeMs: 120, timestamp: "2023-11-06T15:30:00Z" },
  { id: "dl_2", endpointUrl: "https://erp.example.com/webhooks/orders", event: "orders.fulfilled", status: 200, responseTimeMs: 145, timestamp: "2023-11-06T14:45:00Z" },
  { id: "dl_3", endpointUrl: "https://crm.example.com/api/vendors", event: "vendors.registered", status: 500, responseTimeMs: 3000, timestamp: "2023-10-20T10:00:00Z" }
];
