"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Input";
import { formatDate } from "@/lib/utils";
import type { User } from "@/types";

interface UserTableProps {
  users: (User & {
    subscription?: {
      tier: string;
      status: string;
    } | null;
  })[];
  onUserUpdated?: () => void;
}

type SortField = "name" | "email" | "createdAt" | "tier";
type SortOrder = "asc" | "desc";

export const UserTable = ({
  users,
  onUserUpdated,
}: UserTableProps) => {
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [selectedUser, setSelectedUser] = useState<UserTableProps["users"][0] | null>(null);
  const [editTier, setEditTier] = useState("");
  const [editRole, setEditRole] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  // Filter
  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    return (
      u.name?.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q)
    );
  });

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    let aVal = "";
    let bVal = "";

    if (sortField === "name") {
      aVal = a.name ?? "";
      bVal = b.name ?? "";
    } else if (sortField === "email") {
      aVal = a.email;
      bVal = b.email;
    } else if (sortField === "tier") {
      aVal = a.subscription?.tier ?? "free";
      bVal = b.subscription?.tier ?? "free";
    } else {
      aVal = a.createdAt?.toString() ?? "";
      bVal = b.createdAt?.toString() ?? "";
    }

    if (sortOrder === "asc") return aVal.localeCompare(bVal);
    return bVal.localeCompare(aVal);
  });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const openEdit = (user: UserTableProps["users"][0]) => {
    setSelectedUser(user);
    setEditTier(user.subscription?.tier ?? "free");
    setEditRole(user.role ?? "user");
    setSaveError("");
  };

  const handleSave = async () => {
    if (!selectedUser) return;
    setIsSaving(true);
    setSaveError("");

    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUser.id,
          tier: editTier,
          role: editRole,
        }),
      });

      if (!res.ok) throw new Error("Failed to update user");

      setSelectedUser(null);
      onUserUpdated?.();
    } catch {
      setSaveError("Failed to save changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => (
    <span className="font-mono text-[10px] text-white/20 ml-1">
      {sortField === field
        ? sortOrder === "asc"
          ? "↑"
          : "↓"
        : "↕"}
    </span>
  );

  return (
    <>
      {/* Search */}
      <div className="mb-5">
        <input
          type="text"
          placeholder="Search users by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={cn(
            "w-full max-w-sm bg-dark-100 border border-brand-green/20",
            "text-brand-green font-mono text-sm px-4 py-2.5 outline-none",
            "placeholder:text-brand-green/25",
            "focus:border-brand-green/50 transition-colors"
          )}
        />
      </div>

      {/* Table */}
      <div className="border border-white/5 overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-[1fr_1fr_120px_120px_100px_80px] gap-4 px-6 py-3 bg-dark-200 border-b border-white/5">
          {[
            { label: "User", field: "name" as SortField },
            { label: "Email", field: "email" as SortField },
            { label: "Plan", field: "tier" as SortField },
            { label: "Joined", field: "createdAt" as SortField },
            { label: "Role", field: null },
            { label: "Actions", field: null },
          ].map(({ label, field }) => (
            <button
              key={label}
              onClick={() => field && handleSort(field)}
              className={cn(
                "font-mono text-[10px] text-white/20 tracking-[3px] uppercase text-left",
                field && "hover:text-white/40 transition-colors cursor-pointer"
              )}
            >
              {label}
              {field && <SortIcon field={field} />}
            </button>
          ))}
        </div>

        {/* Rows */}
        {sorted.length === 0 ? (
          <div className="px-6 py-12 text-center font-mono text-[10px] text-white/20 tracking-widest">
            NO_USERS_FOUND
          </div>
        ) : (
          sorted.map((user) => (
            <div
              key={user.id}
              className="grid grid-cols-[1fr_1fr_120px_120px_100px_80px] gap-4 px-6 py-4 border-b border-white/5 last:border-0 hover:bg-white/2 transition-colors items-center"
            >
              {/* Name */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-7 h-7 flex items-center justify-center bg-brand-green/10 font-mono text-xs text-brand-green shrink-0">
                  {(user.name ?? user.email)[0].toUpperCase()}
                </div>
                <span className="font-display text-sm text-white/70 truncate">
                  {user.name ?? "—"}
                </span>
              </div>

              {/* Email */}
              <span className="font-mono text-[11px] text-white/40 truncate">
                {user.email}
              </span>

              {/* Plan */}
              <Badge
                variant={
                  user.subscription?.tier === "agency"
                    ? "purple"
                    : user.subscription?.tier === "pro"
                    ? "cyan"
                    : user.subscription?.tier === "freelancer"
                    ? "green"
                    : "ghost"
                }
              >
                {user.subscription?.tier ?? "free"}
              </Badge>

              {/* Joined */}
              <span className="font-mono text-[10px] text-white/30">
                {user.createdAt
                  ? formatDate(user.createdAt, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "—"}
              </span>

              {/* Role */}
              <Badge
                variant={user.role === "admin" ? "red" : "ghost"}
              >
                {user.role ?? "user"}
              </Badge>

              {/* Actions */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => openEdit(user)}
              >
                Edit
              </Button>
            </div>
          ))
        )}
      </div>

      {/* Results count */}
      <div className="mt-3 font-mono text-[10px] text-white/20 tracking-widest">
        {sorted.length} OF {users.length} USERS
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        title={`Edit User — ${selectedUser?.email}`}
        size="sm"
      >
        <div className="flex flex-col gap-5">
          {/* User info */}
          <div className="flex items-center gap-3 pb-4 border-b border-white/5">
            <div className="w-10 h-10 flex items-center justify-center bg-brand-green/10 font-mono text-sm text-brand-green">
              {(selectedUser?.name ?? selectedUser?.email ?? "U")[0].toUpperCase()}
            </div>
            <div>
              <div className="font-display text-sm text-white/70">
                {selectedUser?.name ?? "No name"}
              </div>
              <div className="font-mono text-[11px] text-white/30">
                {selectedUser?.email}
              </div>
            </div>
          </div>

          {/* Tier select */}
          <Select
            label="Subscription Tier"
            value={editTier}
            onChange={setEditTier}
            options={[
              { value: "free", label: "Free" },
              { value: "freelancer", label: "Freelancer — $19/mo" },
              { value: "pro", label: "Pro — $49/mo" },
              { value: "agency", label: "Agency — $129/mo" },
            ]}
          />

          {/* Role select */}
          <Select
            label="User Role"
            value={editRole}
            onChange={setEditRole}
            options={[
              { value: "user", label: "User" },
              { value: "admin", label: "Admin" },
            ]}
          />

          {/* Error */}
          {saveError && (
            <div className="border border-brand-red/30 bg-brand-red/5 px-4 py-3 font-mono text-xs text-brand-red">
              ✕ {saveError}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="primary"
              size="md"
              className="flex-1"
              isLoading={isSaving}
              onClick={handleSave}
            >
              Save Changes
            </Button>
            <Button
              variant="ghost"
              size="md"
              onClick={() => setSelectedUser(null)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};