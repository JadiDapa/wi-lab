import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FolderPlus } from "lucide-react";

export default function DashboardProjects() {
  return (
    <div>
      <h2 className="mb-3 font-semibold">Proyek Inovasi</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {/* Create new project */}
        <Card className="flex items-center justify-center p-6">
          <Button>
            <FolderPlus className="mr-2 h-4 w-4" /> Buat Proyek Baru
          </Button>
        </Card>

        {/* Example project */}
        <Card>
          <CardHeader>
            <CardTitle>Sistem Layanan Terpadu</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground space-y-1 text-sm">
            <p>
              <span className="text-foreground font-medium">Nama Tim:</span> —
            </p>
            <p>
              <span className="text-foreground font-medium">Tujuan:</span>{" "}
              Mengnsi Innangan
            </p>
            <p>
              <span className="text-foreground font-medium">Metode:</span>{" "}
              Podamanfi
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
