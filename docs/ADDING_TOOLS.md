# CyberWraith — How to Add a New Tool

Adding a new tool to CyberWraith is a single-file change
that scales cleanly from 5 tools to 50+.
Follow these steps every time.

---

## Overview

Tools in CyberWraith are config-driven. The master list
lives in one file:
```
src/config/tools.ts
```

Every other part of the platform — the tools grid,
dashboard sidebar, access control, admin panel, and
database — reads from this file automatically.

---

## Step 1 — Add the Tool to Config

Open `src/config/tools.ts` and add a new object to the
`TOOLS` array:
```ts
{
  id: "9",                          // next sequential ID
  slug: "schedulepro",              // URL-safe, unique slug
  name: "SchedulePro",              // display name
  icon: "◷",                        // single emoji or symbol
  tag: "Productivity",              // must match ToolTag type
  color: "#00d4ff",                 // hex color for accents
  description: "Book client calls and manage your calendar automatically.",
  longDescription:
    "SchedulePro connects with Calendly and Google Calendar to automate booking, send reminders, and sync availability across time zones.",
  status: "live",                   // live | beta | coming_soon
  requiredTier: "pro",              // freelancer | pro | agency
  features: [
    "Calendly & Google Calendar sync",
    "Automated booking confirmations",
    "Time zone detection",
    "Custom availability windows",
    "Client reminder sequences",
  ],
  demoAvailable: true,
  releaseDate: undefined,           // set if status is coming_soon
},
```

### Available ToolTag values
```ts
type ToolTag =
  | "Outreach"
  | "Lead Gen"
  | "AI Tools"
  | "Publishing"
  | "Finance"
  | "Automation"
  | "Analytics"
  | "CRM"
  | "Communication"
  | "Productivity";
```

If you need a new tag not in this list, add it to
`src/types/tool.ts` first.

---

## Step 2 — Sync the Database

Run the seed command to upsert the new tool into the
`tool_modules` table:
```bash
npm run db:seed
```

This uses `upsert` so existing tools are not duplicated
and existing data is not lost.

Verify it was added:
```bash
npx prisma studio
```

Open the `tool_modules` table and confirm your new
tool appears.

---

## Step 3 — Create the Tool Page

Create the tool's dashboard page at:
```
src/app/(dashboard)/dashboard/tools/[your-slug]/page.tsx
```

For example for SchedulePro:
```
src/app/(dashboard)/dashboard/tools/schedulepro/page.tsx
```

Use this template:
```tsx
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getToolBySlug } from "@/config/tools";
import { canAccessTool } from "@/config/plans";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { ToolLockedState } from "@/components/tools/ToolLockedState";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SchedulePro",
  description: "Book client calls and manage your calendar automatically.",
};

export default async function ScheduleProPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const tool = getToolBySlug("schedulepro")!;
  const tier = (session.user as { tier?: string }).tier ?? "free";
  const hasAccess = canAccessTool(tier, tool.requiredTier);

  if (!hasAccess) {
    return <ToolLockedState tool={tool} />;
  }

  return (
    <ToolLayout tool={tool}>
      {/* Your tool UI goes here */}
      <div className="border border-white/5 bg-dark-100 p-8 text-center min-h-[300px] flex flex-col items-center justify-center">
        <div className="font-mono text-[10px] text-white/20 tracking-[3px] mb-4">
          // SCHEDULEPRO_WORKSPACE
        </div>
        <p className="text-white/30 font-display text-sm">
          Build your SchedulePro interface here.
        </p>
      </div>
    </ToolLayout>
  );
}
```

---

## Step 4 — Add a Tool Settings Page (Optional)

If your tool needs configuration settings, create:
```
src/app/(dashboard)/dashboard/tools/[your-slug]/settings/page.tsx
```
```tsx
import { ToolLayout } from "@/components/tools/ToolLayout";
import { getToolBySlug } from "@/config/tools";

export default function ScheduleProSettingsPage() {
  const tool = getToolBySlug("schedulepro")!;

  return (
    <ToolLayout tool={tool}>
      <div className="max-w-xl">
        <div className="font-mono text-[10px] text-white/20 tracking-[3px] mb-6">
          // SCHEDULEPRO.settings()
        </div>
        {/* Settings form goes here */}
      </div>
    </ToolLayout>
  );
}
```

---

## Step 5 — Add API Routes (Optional)

If your tool needs its own API endpoints, create them at:
```
src/app/api/tools/schedulepro/route.ts
```
```ts
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { canAccessTool } from "@/config/plans";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const tier =
    (session.user as { tier?: string }).tier ?? "free";

  if (!canAccessTool(tier, "pro")) {
    return NextResponse.json(
      { success: false, error: "Upgrade required" },
      { status: 403 }
    );
  }

  // Your tool logic here
  return NextResponse.json({ success: true, data: {} });
}
```

---

## Step 6 — Verify End to End

Go through this checklist after adding every new tool:

- [ ] Tool appears on homepage tools grid at `/#tools`
- [ ] Tool appears in dashboard sidebar under TOOLS
- [ ] Tool card shows on `/dashboard/tools`
- [ ] Tool page loads at `/dashboard/tools/your-slug`
- [ ] Locked state shows correctly for lower tier users
- [ ] Demo mode works at `/dashboard/tools/your-slug?demo=true`
- [ ] Tool appears in admin tool manager at `/admin/tools`
- [ ] Tool shows in analytics ranking after first usage
- [ ] `generateStaticParams` includes the new slug (automatic
     since it reads from `TOOLS` array)

---

## Step 7 — Deploy
```bash
git add .
git commit -m "feat: add SchedulePro tool"
git push origin main
```

Vercel auto-deploys on every push to `main`.

---

## Quick Reference

| File to touch | Purpose |
|---|---|
| `src/config/tools.ts` | Register the tool (required) |
| `prisma/seed.ts` | Already reads from config (run `npm run db:seed`) |
| `src/app/(dashboard)/dashboard/tools/[slug]/page.tsx` | Tool page UI (required) |
| `src/app/(dashboard)/dashboard/tools/[slug]/settings/page.tsx` | Settings page (optional) |
| `src/app/api/tools/[slug]/route.ts` | Tool-specific API (optional) |

---

## Notes

- The `slug` must be URL-safe: lowercase, hyphens only,
  no spaces or special characters.
- The `id` field is a string and should be unique.
  Use sequential numbers or a short UUID.
- The `color` is used for card accents, icon tinting,
  and progress bars throughout the UI. Pick a color
  that does not clash with existing tools.
- Tools with `status: "coming_soon"` are shown in the
  grid with a disabled state automatically — no extra
  code needed.
- The `demoAvailable` flag enables the demo button on
  tool cards and the `?demo=true` route automatically.