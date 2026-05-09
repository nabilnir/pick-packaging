import type { Order } from '@/types/dashboard';

/** Dynamically imports jsPDF (browser-only) and generates the invoice PDF */
export async function generateInvoice(order: Order): Promise<void> {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });

  const PAGE_W    = 210;
  const MARGIN    = 20;
  const COL_RIGHT = PAGE_W - MARGIN;

  // ── Helpers ────────────────────────────────────────────────────────────────
  const fmtR = (n: number) =>
    'R ' + new Intl.NumberFormat('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

  const fmtDate = (d: string | Date) =>
    new Intl.DateTimeFormat('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' }).format(
      typeof d === 'string' ? new Date(d) : d
    );

  // Due date = 30 days from order date
  const orderDate = typeof order.date === 'string' ? new Date(order.date) : order.date;
  const dueDate   = new Date(orderDate);
  dueDate.setDate(dueDate.getDate() + 30);

  // ── Header ─────────────────────────────────────────────────────────────────
  // Brand block (left)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(28, 58, 42);               // #1c3a2a
  doc.text('PickPacking', MARGIN, 22);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  doc.text('Premium Industrial Packaging', MARGIN, 28);
  doc.text('pickpacking.co.za', MARGIN, 33);

  // "INVOICE" label (right)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(26);
  doc.setTextColor(26, 31, 26);               // #1a1f1a
  doc.text('INVOICE', COL_RIGHT, 22, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  doc.text(`Invoice No: ${order.orderNumber}`, COL_RIGHT, 29, { align: 'right' });
  doc.text(`Date:       ${fmtDate(order.date)}`, COL_RIGHT, 34, { align: 'right' });
  doc.text(`Due Date:   ${fmtDate(dueDate)}`,   COL_RIGHT, 39, { align: 'right' });

  // Divider
  doc.setDrawColor(220, 220, 220);
  doc.line(MARGIN, 46, COL_RIGHT, 46);

  // ── Bill To / Vendor ───────────────────────────────────────────────────────
  let y = 54;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  doc.text('BILL TO', MARGIN, y);

  const MID = PAGE_W / 2;
  if (order.vendor) doc.text('VENDOR', MID, y);

  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(26, 31, 26);

  const addr = order.shippingAddress;
  const billLines = [
    addr.fullName,
    addr.line1,
    addr.line2 ?? null,
    `${addr.city}, ${addr.postalCode}`,
    addr.country,
  ].filter(Boolean) as string[];

  billLines.forEach(line => {
    doc.text(line, MARGIN, y);
    y += 5;
  });

  if (order.vendor) {
    let vy = 59;
    doc.setFont('helvetica', 'bold');
    doc.text(order.vendor.name, MID, vy); vy += 5;
    doc.setFont('helvetica', 'normal');
    if (order.vendor.verified) { doc.text('✔ Verified Vendor', MID, vy); vy += 5; }
  }

  y = Math.max(y, 90);

  // ── Line items table ───────────────────────────────────────────────────────
  // Table header
  const COL = { product: MARGIN, sku: 90, qty: 125, unit: 145, total: COL_RIGHT };

  doc.setFillColor(26, 31, 26);
  doc.rect(MARGIN, y, PAGE_W - MARGIN * 2, 8, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text('PRODUCT', COL.product + 2, y + 5.5);
  doc.text('SKU',     COL.sku,         y + 5.5);
  doc.text('QTY',     COL.qty,         y + 5.5);
  doc.text('UNIT',    COL.unit,        y + 5.5);
  doc.text('TOTAL',   COL.total,       y + 5.5, { align: 'right' });
  y += 10;

  // Rows
  order.items.forEach((item, i) => {
    const unitPrice  = item.price * item.packingType.units * item.packingType.priceMultiplier;
    const lineTotal  = unitPrice * item.quantity;

    if (i % 2 === 0) {
      doc.setFillColor(247, 246, 242);
      doc.rect(MARGIN, y - 1, PAGE_W - MARGIN * 2, 7, 'F');
    }

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(26, 31, 26);

    // Truncate long product names
    const name = item.name.length > 38 ? item.name.substring(0, 36) + '…' : item.name;
    doc.text(name,              COL.product + 2, y + 4);
    doc.text(item.sku ?? '—',   COL.sku,         y + 4);
    doc.text(String(item.quantity), COL.qty,      y + 4);
    doc.text(fmtR(unitPrice),   COL.unit,        y + 4);
    doc.text(fmtR(lineTotal),   COL.total,       y + 4, { align: 'right' });
    y += 8;
  });

  // ── Totals block ───────────────────────────────────────────────────────────
  y += 4;
  doc.setDrawColor(220, 220, 220);
  doc.line(MARGIN, y, COL_RIGHT, y);
  y += 6;

  const totalsLabelX = 130;
  const totalsValueX = COL_RIGHT;

  const totalsRows = [
    { label: 'Subtotal',     value: order.subtotal },
    { label: 'VAT (15%)',    value: order.vat },
    { label: 'Delivery fee', value: order.deliveryFee },
  ];

  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.setFont('helvetica', 'normal');

  totalsRows.forEach(({ label, value }) => {
    doc.text(label, totalsLabelX, y);
    doc.text(fmtR(value), totalsValueX, y, { align: 'right' });
    y += 6;
  });

  // Grand total row
  doc.setFillColor(26, 31, 26);
  doc.rect(totalsLabelX - 4, y - 2, COL_RIGHT - totalsLabelX + 8, 9, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text('TOTAL', totalsLabelX, y + 4.5);
  doc.text(fmtR(order.totalAmount), totalsValueX, y + 4.5, { align: 'right' });
  y += 18;

  // ── Payment details ────────────────────────────────────────────────────────
  if (order.paymentMethod || order.paymentRef) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text('PAYMENT DETAILS', MARGIN, y); y += 5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(26, 31, 26);
    if (order.paymentMethod) { doc.text(`Method: ${order.paymentMethod}`, MARGIN, y); y += 5; }
    if (order.paymentRef)    { doc.text(`Ref: ${order.paymentRef}`,        MARGIN, y); y += 5; }
  }

  // ── Footer ─────────────────────────────────────────────────────────────────
  const FOOTER_Y = 282;
  doc.setDrawColor(220, 220, 220);
  doc.line(MARGIN, FOOTER_Y - 4, COL_RIGHT, FOOTER_Y - 4);
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text(
    'Thank you for your order. Payment terms: 30 days EFT.',
    PAGE_W / 2,
    FOOTER_Y,
    { align: 'center' }
  );

  // ── Save ───────────────────────────────────────────────────────────────────
  const fileName = `PickPacking-Invoice-${order.orderNumber.replace('#', '')}.pdf`;
  doc.save(fileName);
}
