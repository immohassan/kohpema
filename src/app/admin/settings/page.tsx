import { prisma } from "@/lib/prisma";
import SettingsForm from "@/components/admin/SettingsForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Settings" };

export default async function AdminSettingsPage() {
  const settings = await prisma.settings.findUnique({ where: { id: 1 } });

  return (
    <div>
      <h1 className="font-heading font-bold uppercase text-3xl tracking-tight mb-8">
        Settings
      </h1>
      <SettingsForm
        settings={{
          storeName: settings?.storeName ?? "Kohpema Gear",
          whatsappNumber: settings?.whatsappNumber ?? "",
          announcement: settings?.announcement ?? "",
          currency: settings?.currency ?? "PKR",
        }}
      />
    </div>
  );
}
