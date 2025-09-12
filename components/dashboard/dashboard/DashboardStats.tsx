import { Card, CardContent } from "@/components/ui/card";
import { Calendar, BookOpen, FolderPlus } from "lucide-react";

export default function DashboardStats() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardContent className="flex items-center justify-between p-4">
          <div>
            <p className="text-muted-foreground text-sm">Pelatihan diikuti</p>
            <h2 className="text-2xl font-bold">4</h2>
          </div>
          <BookOpen className="text-primary h-8 w-8" />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center justify-between p-4">
          <div>
            <p className="text-muted-foreground text-sm">Proyek berjalan</p>
            <h2 className="text-2xl font-bold">—</h2>
          </div>
          <FolderPlus className="text-primary h-8 w-8" />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center justify-between p-4">
          <div>
            <p className="text-muted-foreground text-sm">Jadwal pelatihan</p>
            <h2 className="text-base font-semibold">Rabu, 7 Mei 2024</h2>
          </div>
          <Calendar className="text-primary h-8 w-8" />
        </CardContent>
      </Card>
    </div>
  );
}
