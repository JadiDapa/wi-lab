"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  amount: string;
  description: string;
  icon: LucideIcon;
}

export function StatCard({
  title,
  amount,
  description,
  icon: Icon,
}: StatCardProps) {
  return (
    <Card className="flex items-center justify-between rounded-2xl p-4 shadow-sm">
      <CardContent className="flex w-full items-center justify-between p-0">
        <div className="flex flex-col">
          <span className="text-muted-foreground text-sm">{title}</span>
          <span className="text-2xl font-semibold">{amount}</span>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-muted-foreground text-sm">{description}</span>
          </div>
        </div>
        <div className="bg-muted rounded-lg p-2">
          <Icon className="text-muted-foreground h-6 w-6" />
        </div>
      </CardContent>
    </Card>
  );
}
