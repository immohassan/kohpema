"use client";

import { useActionState } from "react";
import { updateSettings } from "@/lib/actions/settings";

export default function SettingsForm({
  settings,
}: {
  settings: {
    storeName: string;
    whatsappNumber: string;
    announcement: string;
    currency: string;
  };
}) {
  const [state, formAction, pending] = useActionState(updateSettings, {});

  return (
    <form action={formAction} className="bg-white border border-neutral-200 p-6 space-y-4 max-w-xl">
      <div>
        <label className="label">Store Name</label>
        <input name="storeName" className="input" defaultValue={settings.storeName} required />
      </div>
      <div>
        <label className="label">WhatsApp Number (orders go here)</label>
        <input
          name="whatsappNumber"
          className="input"
          defaultValue={settings.whatsappNumber}
          placeholder="+923001234567"
        />
        <p className="text-xs text-neutral-500 mt-1">
          International format with country code. Customers&apos; orders open a
          WhatsApp chat with this number.
        </p>
      </div>
      <div>
        <label className="label">Announcement Bar</label>
        <input
          name="announcement"
          className="input"
          defaultValue={settings.announcement}
          placeholder="FREE Shipping over $99"
        />
      </div>
      <div>
        <label className="label">Currency Code</label>
        <input
          name="currency"
          className="input !w-28"
          defaultValue={settings.currency}
          maxLength={3}
        />
      </div>
      {state?.error && <div className="text-red-600 text-sm">{state.error}</div>}
      {state?.ok && <div className="text-green-700 text-sm">Settings saved ✓</div>}
      <button type="submit" disabled={pending} className="btn-accent">
        {pending ? "Saving..." : "Save Settings"}
      </button>
    </form>
  );
}
