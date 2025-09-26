"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Star, User } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllUsers, getUserById, updateUser } from "@/lib/networks/user";
import { useAccount } from "@/providers/AccountProvider";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import Link from "next/link";
import { CreateUserType, UserType } from "@/lib/types/user";
import { toast } from "sonner";
import {
  Command,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";

/* ---------------- Parent Section ---------------- */

export default function TeacherSection() {
  const { account } = useAccount();

  const { data: teacher } = useQuery({
    queryKey: ["teacher", account?.teacherId],
    queryFn: () => getUserById(account?.teacherId as string),
  });

  return (
    <section className="space-y-6 p-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-medium">Widyaiswara Kamu</h2>

        <div className="flex items-center gap-2"></div>
      </div>

      <div className="w-full">
        {teacher ? (
          <ProfileSection teacher={teacher as UserType} />
        ) : (
          <SelectTeacher />
        )}
      </div>
    </section>
  );
}

export function ProfileSection({ teacher }: { teacher: UserType }) {
  return (
    <div className="mx-auto">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Left Column */}
        <div>
          <Image
            src="/images/icon.png"
            alt="Profile picture"
            width={300}
            height={300}
            className="rounded-xl border object-cover"
          />
          <div className="mt-6 space-y-6">
            {/* <ProfileWork />
            <ProfileSkills /> */}
          </div>
        </div>

        {/* Right Column */}
        <div className="md:col-span-2">
          <ProfileHeader name={teacher?.fullName} nip={teacher.nip} />
          {/* <CardContent className="p-0">
            <ProfileTabs />
          </CardContent> */}
        </div>
      </div>
    </div>
  );
}

function ProfileHeader({
  name,
  nip,
  rating = 8.6,
  stars = 4,
}: {
  name?: string;
  nip?: string;
  rating?: number;
  stars?: number;
}) {
  return (
    <div>
      <CardHeader className="p-0">
        <CardTitle className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">{name}</h2>
            <p className="text-muted-foreground text-sm">{nip}</p>
          </div>
        </CardTitle>
      </CardHeader>

      {/* Rating */}
      <div className="mt-4 flex items-center gap-2">
        <p className="text-lg font-semibold">{rating}</p>
        <div className="flex text-blue-500">
          {[...Array(stars)].map((_, i) => (
            <Star key={i} size={18} fill="currentColor" />
          ))}
          {[...Array(5 - stars)].map((_, i) => (
            <Star key={i} size={18} className="text-muted-foreground" />
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 flex gap-2">
        <Button size="sm">Send message</Button>
        <Button size="sm" variant="secondary">
          Contacts
        </Button>
      </div>

      <Separator className="my-4" />
    </div>
  );
}

function ProfileWork({
  works = [
    {
      place: "Spotify New York",
      type: "Primary",
      address: "170 William Street, New York, NY 10038-78 212-312-51",
    },
    {
      place: "Metropolitan Museum",
      type: "Secondary",
      address: "525 E 68th Street, New York, NY 10651-78 156-187-60",
    },
  ],
}: {
  works?: { place: string; type: string; address: string }[];
}) {
  return (
    <div>
      <h3 className="mb-2 font-semibold">Work</h3>
      <div className="space-y-2 text-sm">
        {works.map((w, i) => (
          <div key={i}>
            <p className="font-medium">
              {w.place}{" "}
              <span className="ml-2 rounded bg-blue-500 px-2 py-0.5 text-xs text-white">
                {w.type}
              </span>
            </p>
            <p className="text-muted-foreground">{w.address}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProfileSkills({
  skills = [
    "Branding",
    "UI/UX",
    "Web Design",
    "Packaging",
    "Print & Editorial",
  ],
}: {
  skills?: string[];
}) {
  return (
    <div>
      <h3 className="mb-2 font-semibold">Skills</h3>
      <ul className="text-muted-foreground list-inside list-disc space-y-1 text-sm">
        {skills.map((s, i) => (
          <li key={i}>{s}</li>
        ))}
      </ul>
    </div>
  );
}

function ProfileContact({
  phone = "+1 123 456 7890",
  address = "525 E 68th Street, New York, NY 10651-78 156-187-60",
  email = "hello@jeremyrose.com",
  site = "www.jeremyrose.com",
}: {
  phone?: string;
  address?: string;
  email?: string;
  site?: string;
}) {
  return (
    <div>
      <h3 className="mb-2 font-semibold">Contact Information</h3>
      <ul className="space-y-2 text-sm">
        <li>
          <span className="font-medium">Phone:</span>{" "}
          <Link href={`tel:${phone}`} className="text-blue-500">
            {phone}
          </Link>
        </li>
        <li>
          <span className="font-medium">Address:</span> {address}
        </li>
        <li>
          <span className="font-medium">E-mail:</span>{" "}
          <Link href={`mailto:${email}`} className="text-blue-500">
            {email}
          </Link>
        </li>
        <li>
          <span className="font-medium">Site:</span>{" "}
          <Link
            href={`http://${site}`}
            target="_blank"
            className="text-blue-500"
          >
            {site}
          </Link>
        </li>
      </ul>
    </div>
  );
}

function ProfileBasicInfo({
  birthday = "June 5, 1992",
  gender = "Male",
}: {
  birthday?: string;
  gender?: string;
}) {
  return (
    <div>
      <h3 className="mb-2 font-semibold">Basic Information</h3>
      <ul className="space-y-2 text-sm">
        <li>
          <span className="font-medium">Birthday:</span> {birthday}
        </li>
        <li>
          <span className="font-medium">Gender:</span> {gender}
        </li>
      </ul>
    </div>
  );
}

function ProfileTabs() {
  return (
    <Tabs defaultValue="about">
      <TabsList>
        <TabsTrigger value="timeline">Timeline</TabsTrigger>
        <TabsTrigger value="about">About</TabsTrigger>
      </TabsList>

      <TabsContent value="about" className="mt-4 space-y-6">
        <ProfileContact />
        <ProfileBasicInfo />
      </TabsContent>

      <TabsContent value="timeline" className="mt-4">
        <p className="text-muted-foreground text-sm">Timeline goes here...</p>
      </TabsContent>
    </Tabs>
  );
}

export function SelectTeacher() {
  const { account } = useAccount();
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: teachers, isLoading } = useQuery({
    queryKey: ["teachers"],
    queryFn: () => getAllUsers(),
  });

  const { mutateAsync: updateUserAsync, isPending } = useMutation({
    mutationFn: (values: CreateUserType) =>
      updateUser(account?.id as string, values),
    onSuccess: () => {
      toast.success("Teacher assigned successfully!");
      queryClient.invalidateQueries({ queryKey: ["teacher"] });
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      router.refresh();
    },
    onError: () => {
      toast.error("Failed to assign teacher");
    },
  });

  const [selectedTeacher, setSelectedTeacher] = useState<UserType | null>(null);

  const handleAssign = async () => {
    if (!selectedTeacher) {
      toast.error("Please select a teacher first.");
      return;
    }

    await updateUserAsync({
      ...account!,
      teacherId: selectedTeacher.id,
    });
  };

  if (isLoading) {
    return <p className="text-muted-foreground text-sm">Loading teachers...</p>;
  }

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Assign a Teacher</CardTitle>
        <CardDescription>
          You don’t have a teacher assigned yet. Please choose one below.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Command>
          <CommandInput placeholder="Search teacher by name or NIM..." />
          <CommandEmpty>No teachers found.</CommandEmpty>
          <CommandGroup heading="Available Teachers">
            {teachers
              ?.filter((u: UserType) => u.role === "LECTURER")
              .map((teacher: UserType) => (
                <CommandItem
                  key={teacher.id}
                  value={teacher.fullName}
                  onSelect={() => setSelectedTeacher(teacher)}
                >
                  <div className="flex w-full items-center gap-3">
                    <Avatar className="size-14">
                      <AvatarImage
                        src={teacher.avatarUrl || ""}
                        alt={teacher.fullName}
                      />
                      <AvatarFallback className="telg">
                        {teacher.fullName
                          .split(" ")
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-1 flex-col">
                      <span className="text-lg font-medium">
                        {teacher.fullName}
                      </span>
                      <span className="text-muted-foreground mt-1 text-xs">
                        NIP: {teacher.nim ?? "—"}
                      </span>
                      <span className="text-muted-foreground mt-0.5 text-xs">
                        Students: {teacher.students?.length ?? 0}
                      </span>
                    </div>
                    {selectedTeacher?.id === teacher.id && (
                      <Check className="text-primary h-4 w-4" />
                    )}
                  </div>
                </CommandItem>
              ))}
          </CommandGroup>
        </Command>

        <Button
          onClick={handleAssign}
          disabled={isPending || !selectedTeacher}
          className="w-fit"
        >
          {isPending ? "Assigning..." : "Assign Teacher"}
        </Button>
      </CardContent>
    </Card>
  );
}
