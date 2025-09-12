import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Role } from "@/lib/types/user";

export default function ChatHeader({
  activeTab,
  setActiveTab,
  userRole,
  usersCount,
}: {
  activeTab: string;
  setActiveTab: (val: string) => void;
  userRole: Role;
  usersCount: number;
}) {
  return (
    <div className="p-4">
      <Tabs
        defaultValue="inbox"
        value={activeTab}
        onValueChange={setActiveTab}
        className="mb-4"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="inbox">
            {userRole === "STUDENT" ? "Teacher" : "Students"}{" "}
            <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-600">
              {usersCount}
            </span>
          </TabsTrigger>
          <TabsTrigger value="explore">
            Groups{" "}
            <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-600">
              {0}
            </span>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {userRole === "LECTURER" && (
        <Button className="mb-4 w-full">Create New Group</Button>
      )}
      <Input placeholder="Search" />
    </div>
  );
}
