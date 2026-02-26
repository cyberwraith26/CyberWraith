"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { cn, formatCurrency } from "@/lib/utils";
import type { Tool } from "@/types";

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
}

interface Invoice {
  id: string;
  number: string;
  client: string;
  email: string;
  status: "draft" | "sent" | "paid" | "overdue";
  amount: number;
  dueDate: string;
  createdAt: string;
  items: LineItem[];
  notes: string;
  currency: string;
}

interface InvoiceProAppProps {
  userId: string;
  tool: Tool;
}

const MOCK_INVOICES: Invoice[] = [
  {
    id: "1",
    number: "INV-001",
    client: "Acme Corp",
    email: "billing@acme.com",
    status: "paid",
    amount: 2500,
    dueDate: "Jan 15, 2025",
    createdAt: "Jan 1, 2025",
    currency: "USD",
    notes: "Thank you for your business.",
    items: [
      { id: "i1", description: "Website Redesign", quantity: 1, rate: 2000 },
      { id: "i2", description: "SEO Optimization", quantity: 1, rate: 500 },
    ],
  },
  {
    id: "2",
    number: "INV-002",
    client: "Startup IO",
    email: "finance@startup.io",
    status: "sent",
    amount: 1800,
    dueDate: "Feb 1, 2025",
    createdAt: "Jan 15, 2025",
    currency: "USD",
    notes: "Payment due within 15 days.",
    items: [
      { id: "i3", description: "Mobile App Development", quantity: 1, rate: 1800 },
    ],
  },
  {
    id: "3",
    number: "INV-003",
    client: "Agency Co",
    email: "accounts@agency.co",
    status: "overdue",
    amount: 3200,
    dueDate: "Jan 10, 2025",
    createdAt: "Dec 27, 2024",
    currency: "USD",
    notes: "Please process payment at your earliest convenience.",
    items: [
      { id: "i4", description: "Brand Identity Design", quantity: 1, rate: 2500 },
      { id: "i5", description: "Social Media Kit", quantity: 1, rate: 700 },
    ],
  },
];

type View = "invoices" | "create" | "preview";

const STATUS_COLORS = {
  draft: "ghost",
  sent: "cyan",
  paid: "green",
  overdue: "red",
} as const;

export const InvoiceProApp = ({ tool }: InvoiceProAppProps) => {
  const [invoices, setInvoices] = useState<Invoice[]>(MOCK_INVOICES);
  const [activeView, setActiveView] = useState<View>("invoices");
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // New invoice form state
  const [form, setForm] = useState({
    client: "",
    email: "",
    dueDate: "",
    currency: "USD",
    notes: "Thank you for your business.",
  });
  const [items, setItems] = useState<LineItem[]>([
    { id: "new1", description: "", quantity: 1, rate: 0 },
  ]);

  const total = items.reduce(
    (sum, item) => sum + item.quantity * item.rate,
    0
  );

  const totalPaid = invoices
    .filter((i) => i.status === "paid")
    .reduce((sum, i) => sum + i.amount, 0);

  const totalOutstanding = invoices
    .filter((i) => i.status === "sent" || i.status === "overdue")
    .reduce((sum, i) => sum + i.amount, 0);

  const addLineItem = () => {
    setItems((prev) => [
      ...prev,
      { id: Date.now().toString(), description: "", quantity: 1, rate: 0 },
    ]);
  };

  const updateItem = (
    id: string,
    field: keyof LineItem,
    value: string | number
  ) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const removeItem = (id: string) => {
    if (items.length === 1) return;
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const createInvoice = () => {
    if (!form.client.trim() || !form.email.trim()) return;
    const newInvoice: Invoice = {
      id: Date.now().toString(),
      number: `INV-00${invoices.length + 1}`,
      client: form.client,
      email: form.email,
      status: "draft",
      amount: total,
      dueDate: form.dueDate || "TBD",
      createdAt: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      currency: form.currency,
      notes: form.notes,
      items: [...items],
    };
    setInvoices((prev) => [newInvoice, ...prev]);
    setSelectedInvoice(newInvoice);
    setActiveView("preview");
    setForm({
      client: "",
      email: "",
      dueDate: "",
      currency: "USD",
      notes: "Thank you for your business.",
    });
    setItems([{ id: "new1", description: "", quantity: 1, rate: 0 }]);
  };

  const markAsSent = (id: string) => {
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === id ? { ...inv, status: "sent" } : inv
      )
    );
    if (selectedInvoice?.id === id) {
      setSelectedInvoice((prev) =>
        prev ? { ...prev, status: "sent" } : prev
      );
    }
  };

  const markAsPaid = (id: string) => {
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === id ? { ...inv, status: "paid" } : inv
      )
    );
    if (selectedInvoice?.id === id) {
      setSelectedInvoice((prev) =>
        prev ? { ...prev, status: "paid" } : prev
      );
    }
  };

  const deleteInvoice = (id: string) => {
    setInvoices((prev) => prev.filter((inv) => inv.id !== id));
    setSelectedInvoice(null);
    setActiveView("invoices");
    setShowDeleteConfirm(false);
  };

  return (
    <ToolLayout tool={tool}>
      <div className="flex flex-col lg:flex-row gap-6 min-h-[calc(100vh-200px)]">

        {/* ── Sidebar ─────────────────────────────────── */}
        <aside className="w-full lg:w-[260px] shrink-0 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-white/25 tracking-[3px]">
              // INVOICES
            </span>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setActiveView("create")}
            >
              + New
            </Button>
          </div>

          {/* Summary stats */}
          <div className="grid grid-cols-2 gap-2 mb-2">
            <div className="border border-white/5 bg-dark-100 p-3">
              <div className="font-mono text-sm font-bold text-brand-green mb-0.5">
                ${totalPaid.toLocaleString()}
              </div>
              <div className="font-mono text-[9px] text-white/20 tracking-widest">
                COLLECTED
              </div>
            </div>
            <div className="border border-white/5 bg-dark-100 p-3">
              <div className="font-mono text-sm font-bold text-brand-amber mb-0.5">
                ${totalOutstanding.toLocaleString()}
              </div>
              <div className="font-mono text-[9px] text-white/20 tracking-widest">
                OUTSTANDING
              </div>
            </div>
          </div>

          {/* Invoice list */}
          {invoices.map((inv) => (
            <button
              key={inv.id}
              onClick={() => {
                setSelectedInvoice(inv);
                setActiveView("preview");
              }}
              className={cn(
                "w-full text-left border p-4 transition-all duration-200",
                selectedInvoice?.id === inv.id && activeView === "preview"
                  ? "border-brand-red/40 bg-brand-red/5"
                  : "border-white/5 bg-dark-100 hover:border-white/10"
              )}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-[11px] text-white/50">
                  {inv.number}
                </span>
                <Badge variant={STATUS_COLORS[inv.status]}>
                  {inv.status}
                </Badge>
              </div>
              <div className="font-display font-semibold text-sm text-white/80 mb-1 truncate">
                {inv.client}
              </div>
              <div className="font-mono text-sm text-brand-red font-bold">
                ${inv.amount.toLocaleString()}
              </div>
            </button>
          ))}
        </aside>

        {/* ── Main Workspace ───────────────────────────── */}
        <div className="flex-1 flex flex-col gap-5 min-w-0">

          {/* ── INVOICES LIST VIEW ─────────────────────── */}
          {activeView === "invoices" && (
            <Card className="flex-1">
              <div className="px-6 py-4 border-b border-white/5">
                <span className="font-mono text-[10px] text-white/25 tracking-[3px]">
                  // ALL_INVOICES
                </span>
              </div>
              {/* Table header */}
              <div className="grid grid-cols-[80px_1fr_100px_120px_100px_100px] gap-4 px-6 py-3 border-b border-white/5 bg-dark-200">
                {["Number", "Client", "Amount", "Due Date", "Status", ""].map((h) => (
                  <div key={h} className="font-mono text-[10px] text-white/20 tracking-[3px] uppercase">
                    {h}
                  </div>
                ))}
              </div>
              <CardContent className="p-0">
                {invoices.map((inv) => (
                  <div
                    key={inv.id}
                    className="grid grid-cols-[80px_1fr_100px_120px_100px_100px] gap-4 px-6 py-4 border-b border-white/5 last:border-0 hover:bg-white/2 transition-colors items-center"
                  >
                    <span className="font-mono text-[11px] text-white/40">
                      {inv.number}
                    </span>
                    <div>
                      <div className="font-display text-sm text-white/70">
                        {inv.client}
                      </div>
                      <div className="font-mono text-[10px] text-white/25">
                        {inv.email}
                      </div>
                    </div>
                    <span className="font-mono text-sm text-brand-red font-bold">
                      ${inv.amount.toLocaleString()}
                    </span>
                    <span className="font-mono text-[10px] text-white/30">
                      {inv.dueDate}
                    </span>
                    <Badge variant={STATUS_COLORS[inv.status]}>
                      {inv.status}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedInvoice(inv);
                        setActiveView("preview");
                      }}
                    >
                      View
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* ── CREATE INVOICE VIEW ────────────────────── */}
          {activeView === "create" && (
            <Card className="flex-1">
              <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
                <span className="font-mono text-[10px] text-white/25 tracking-[3px]">
                  // NEW_INVOICE
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveView("invoices")}
                >
                  ← Cancel
                </Button>
              </div>
              <CardContent className="p-6 flex flex-col gap-6">
                {/* Client details */}
                <div>
                  <div className="font-mono text-[10px] text-white/20 tracking-[3px] mb-4">
                    // CLIENT_DETAILS
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Client Name"
                      placeholder="Acme Corp"
                      value={form.client}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, client: e.target.value }))
                      }
                    />
                    <Input
                      label="Client Email"
                      type="email"
                      placeholder="billing@client.com"
                      value={form.email}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, email: e.target.value }))
                      }
                    />
                    <Input
                      label="Due Date"
                      type="date"
                      value={form.dueDate}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, dueDate: e.target.value }))
                      }
                    />
                    <Input
                      label="Currency"
                      value={form.currency}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, currency: e.target.value }))
                      }
                    />
                  </div>
                </div>

                {/* Line items */}
                <div>
                  <div className="font-mono text-[10px] text-white/20 tracking-[3px] mb-4">
                    // LINE_ITEMS
                  </div>
                  <div className="flex flex-col gap-3">
                    {/* Header */}
                    <div className="grid grid-cols-[1fr_80px_100px_80px_32px] gap-3">
                      {["Description", "Qty", "Rate", "Total", ""].map((h) => (
                        <div key={h} className="font-mono text-[10px] text-white/20 tracking-widest uppercase">
                          {h}
                        </div>
                      ))}
                    </div>
                    {/* Items */}
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="grid grid-cols-[1fr_80px_100px_80px_32px] gap-3 items-center"
                      >
                        <input
                          type="text"
                          placeholder="Service description"
                          value={item.description}
                          onChange={(e) =>
                            updateItem(item.id, "description", e.target.value)
                          }
                          className="bg-dark-100 border border-brand-green/20 text-brand-green font-mono text-sm px-3 py-2 outline-none placeholder:text-brand-green/25 focus:border-brand-green/50 transition-colors"
                        />
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            updateItem(item.id, "quantity", parseFloat(e.target.value) || 0)
                          }
                          className="bg-dark-100 border border-brand-green/20 text-brand-green font-mono text-sm px-3 py-2 outline-none focus:border-brand-green/50 transition-colors"
                        />
                        <input
                          type="number"
                          value={item.rate}
                          onChange={(e) =>
                            updateItem(item.id, "rate", parseFloat(e.target.value) || 0)
                          }
                          className="bg-dark-100 border border-brand-green/20 text-brand-green font-mono text-sm px-3 py-2 outline-none focus:border-brand-green/50 transition-colors"
                        />
                        <div className="font-mono text-sm text-brand-green">
                          ${(item.quantity * item.rate).toLocaleString()}
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-white/20 hover:text-brand-red transition-colors font-mono"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="self-start"
                      onClick={addLineItem}
                    >
                      + Add Line Item
                    </Button>
                  </div>

                  {/* Total */}
                  <div className="flex justify-end mt-4 pt-4 border-t border-white/5">
                    <div className="text-right">
                      <div className="font-mono text-[10px] text-white/20 tracking-widest mb-1">
                        TOTAL
                      </div>
                      <div className="font-mono text-3xl font-bold text-brand-red">
                        ${total.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div className="flex flex-col gap-2">
                  <label className="font-mono text-[10px] text-brand-green/60 tracking-widest uppercase">
                    Notes //
                  </label>
                  <textarea
                    rows={3}
                    value={form.notes}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, notes: e.target.value }))
                    }
                    className="w-full bg-dark-100 border border-brand-green/20 text-brand-green font-mono text-sm px-4 py-3 outline-none focus:border-brand-green/50 transition-colors resize-none"
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button
                    variant="primary"
                    size="md"
                    onClick={createInvoice}
                  >
                    Create Invoice →
                  </Button>
                  <Button
                    variant="ghost"
                    size="md"
                    onClick={() => setActiveView("invoices")}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* ── PREVIEW VIEW ───────────────────────────── */}
          {activeView === "preview" && selectedInvoice && (
            <div className="flex flex-col gap-5">
              {/* Actions */}
              <div className="flex items-center justify-between gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveView("invoices")}
                >
                  ← All Invoices
                </Button>
                <div className="flex gap-2">
                  {selectedInvoice.status === "draft" && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => markAsSent(selectedInvoice.id)}
                    >
                      Mark as Sent
                    </Button>
                  )}
                  {selectedInvoice.status === "sent" && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => markAsPaid(selectedInvoice.id)}
                    >
                      Mark as Paid ✓
                    </Button>
                  )}
                  {selectedInvoice.status === "overdue" && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => markAsPaid(selectedInvoice.id)}
                    >
                      Mark as Paid ✓
                    </Button>
                  )}
                  <Button variant="secondary" size="sm">
                    Download PDF
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => setShowDeleteConfirm(true)}
                  >
                    Delete
                  </Button>
                </div>
              </div>

              {/* Invoice preview */}
              <Card>
                <CardContent className="p-8">
                  {/* Invoice header */}
                  <div className="flex items-start justify-between mb-10">
                    <div>
                      <div className="font-mono text-2xl font-bold text-brand-red mb-1">
                        {selectedInvoice.number}
                      </div>
                      <div className="font-mono text-[10px] text-white/25 tracking-widest">
                        CREATED {selectedInvoice.createdAt.toUpperCase()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-lg tracking-[3px] text-white mb-1">
                        CYBER<span className="text-brand-green">WRAITH</span>
                      </div>
                      <Badge variant={STATUS_COLORS[selectedInvoice.status]}>
                        {selectedInvoice.status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>

                  {/* Bill to */}
                  <div className="mb-8">
                    <div className="font-mono text-[10px] text-white/20 tracking-[3px] mb-2">
                      BILL TO
                    </div>
                    <div className="font-display font-bold text-xl text-white mb-1">
                      {selectedInvoice.client}
                    </div>
                    <div className="font-mono text-[11px] text-white/40">
                      {selectedInvoice.email}
                    </div>
                  </div>

                  {/* Due date */}
                  <div className="flex gap-12 mb-8">
                    <div>
                      <div className="font-mono text-[10px] text-white/20 tracking-[3px] mb-1">
                        DUE DATE
                      </div>
                      <div className="font-display text-sm text-white/70">
                        {selectedInvoice.dueDate}
                      </div>
                    </div>
                    <div>
                      <div className="font-mono text-[10px] text-white/20 tracking-[3px] mb-1">
                        CURRENCY
                      </div>
                      <div className="font-display text-sm text-white/70">
                        {selectedInvoice.currency}
                      </div>
                    </div>
                  </div>

                  {/* Line items */}
                  <div className="border border-white/5 mb-6">
                    <div className="grid grid-cols-[1fr_80px_100px_100px] gap-4 px-5 py-3 bg-dark-200 border-b border-white/5">
                      {["Description", "Qty", "Rate", "Total"].map((h) => (
                        <div key={h} className="font-mono text-[10px] text-white/20 tracking-[3px] uppercase">
                          {h}
                        </div>
                      ))}
                    </div>
                    {selectedInvoice.items.map((item) => (
                      <div
                        key={item.id}
                        className="grid grid-cols-[1fr_80px_100px_100px] gap-4 px-5 py-4 border-b border-white/5 last:border-0"
                      >
                        <span className="font-display text-sm text-white/70">
                          {item.description}
                        </span>
                        <span className="font-mono text-sm text-white/40">
                          {item.quantity}
                        </span>
                        <span className="font-mono text-sm text-white/40">
                          ${item.rate.toLocaleString()}
                        </span>
                        <span className="font-mono text-sm text-brand-red font-bold">
                          ${(item.quantity * item.rate).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Total */}
                  <div className="flex justify-end mb-6">
                    <div className="text-right">
                      <div className="font-mono text-[10px] text-white/20 tracking-[3px] mb-1">
                        TOTAL DUE
                      </div>
                      <div className="font-mono text-4xl font-bold text-brand-red">
                        ${selectedInvoice.amount.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  {selectedInvoice.notes && (
                    <div className="border-t border-white/5 pt-5">
                      <div className="font-mono text-[10px] text-white/20 tracking-[3px] mb-2">
                        NOTES
                      </div>
                      <p className="font-display text-sm text-white/40 leading-relaxed">
                        {selectedInvoice.notes}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirm Modal */}
      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Delete Invoice"
        size="sm"
      >
        <div className="flex flex-col gap-5">
          <p className="font-display text-white/60 leading-relaxed">
            Are you sure you want to delete{" "}
            <span className="text-white font-semibold">
              {selectedInvoice?.number}
            </span>
            ? This cannot be undone.
          </p>
          <div className="flex gap-3">
            <Button
              variant="danger"
              size="md"
              className="flex-1"
              onClick={() =>
                selectedInvoice && deleteInvoice(selectedInvoice.id)
              }
            >
              Delete Invoice
            </Button>
            <Button
              variant="ghost"
              size="md"
              onClick={() => setShowDeleteConfirm(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </ToolLayout>
  );
};