"use client";

import Link from "next/link";
import ImageComponent from "next/image";
import { ClerkLoaded, ClerkLoading, UserButton, useUser } from "@clerk/nextjs";
import { Crown, Flame, Loader2 } from "lucide-react";
import { useUserStore } from "@/store/user.store";
import { useEffect } from "react";
import { toast } from "sonner";
import { getUserByUserId } from "@/queries/db";
import { Button } from "@/components/ui/button";
import { useModal } from "@/store/modal.store";

export default function Header() {
  const { user: dbUser, setUser } = useUserStore();
  const { user } = useUser();
  const { onOpen: openModal } = useModal();

  useEffect(() => {
    if (!user) return;

    if (!dbUser) {
      const getDbUser = async () => {
        const res = await getUserByUserId(user.id);
        if (res.error) {
          console.log(res.error);
          return toast.error("Couldn't get user data!");
        }

        if (res.data) {
          setUser(res.data);
        }
      };

      getDbUser();
    }
  }, [dbUser, user]);

  return (
    <header className="flex items-center justify-between">
      <Link href={"/"}>
        <ImageComponent
          src="/images/logo-text.png"
          alt="logo"
          width={200}
          height={100}
          className=" w-26 md:w-28"
        />
      </Link>

      <div>
        <ClerkLoading>
          <Loader2 className="animate-spin" />
        </ClerkLoading>
        <ClerkLoaded>
          <div className="flex items-center gap-6">
            {dbUser && (
              <div className="flex items-center gap-6">
                {!dbUser.has_subscription && (
                  <Button
                    onClick={() => openModal("SUBSCRIPTION")}
                    variant={"secondary"}
                    className="text-orange-500 cursor-pointer hover:bg-orange-500/10"
                  >
                    <Crown /> Go Pro
                  </Button>
                )}
                <div className="flex items-center gap-1 font-semibold">
                  <Flame className="text-orange-600 fill-orange-600" />{" "}
                  {dbUser.credits}
                </div>
              </div>
            )}
            <UserButton />
          </div>
        </ClerkLoaded>
      </div>
    </header>
  );
}
