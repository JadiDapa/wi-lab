import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

const modules = [
  {
    title: "Pemecahan Masalah Etetkit",
    status: "Belum diikuti",
    variant: "outline",
  },
  {
    title: "Pelayanan Publik Prima",
    status: "Sedang berlangsung",
    variant: "default",
  },
  {
    title: "Manajemen ASN Berbasis Kinerja",
    status: "Selesai",
    variant: "secondary",
  },
];

export default function DashboardModules() {
  return (
    <div className="flex gap-6">
      <div className="flex-3">
        <h2 className="mb-3 font-semibold">Modul Pelatihan</h2>
        <div className="space-y-3">
          {modules.map((m, idx) => (
            <Card key={idx} className="flex flex-row items-center p-4">
              <Checkbox />
              <p className="flex-6 font-medium">{m.title}</p>
              <Badge variant={m.variant} className="flex-3">
                {m.status}
              </Badge>
              <ChevronRight className="flex-1" />
            </Card>
          ))}
        </div>
      </div>
      <div className="flex-2">
        <h2 className="mb-3 font-semibold">Manajemen</h2>
        <div className="space-y-3">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-lg font-medium">
                Manajemen ASN Berbasis Kinerja
              </p>
              <ChevronRight />
            </div>
            <p className="text-sm text-slate-500">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quas qui
              id reprehenderit?
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
