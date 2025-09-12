"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  ReactNode,
} from "react";
import { useUser } from "@clerk/nextjs";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { UserType } from "@/lib/types/user";
import { getUserByEmail } from "@/lib/networks/user";

interface AccountContextType {
  account?: UserType | null;
  loading: boolean;
  refetch: () => void;
}

const AccountContext = createContext<AccountContextType | null>(null);

export function AccountProvider({ children }: { children: ReactNode }) {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  const userEmail = user?.primaryEmailAddress?.emailAddress ?? "";
  const isLoginPage = pathname === "/sign-in" || pathname === "/sign-up";
  const isRootPage = pathname === "/";

  useEffect(() => {
    if (isLoaded && !user && !isLoginPage && !isRootPage) {
      router.push("/sign-in");
    }
  }, [isLoaded, user, isLoginPage, isRootPage, router]);

  const {
    data: account,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["account", userEmail], // ✅ unified key
    queryFn: () => getUserByEmail(userEmail),
    enabled: !!userEmail,
  });

  // Load from localStorage first
  useEffect(() => {
    if (userEmail) {
      const saved = localStorage.getItem("account");
      if (saved) {
        queryClient.setQueryData(["account", userEmail], JSON.parse(saved));
      }
    }
  }, [userEmail, queryClient]);

  // Save to localStorage
  useEffect(() => {
    if (account) {
      localStorage.setItem("account", JSON.stringify(account));
    }
  }, [account]);

  const value = useMemo(
    () => ({
      account,
      loading: isLoading,
      refetch,
    }),
    [account, isLoading, refetch],
  );

  if (!isLoaded) return null; // Clerk still loading
  if (!user && !isLoginPage && !isRootPage) return null; // redirect pending

  return (
    <AccountContext.Provider value={value}>{children}</AccountContext.Provider>
  );
}

export function useAccount(): AccountContextType {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error("useAccount must be used within an AccountProvider");
  }
  return context;
}
