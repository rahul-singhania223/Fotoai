"use client";

import { useModal } from "@/store/modal.store";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CheckCircle2, Crown } from "lucide-react";
import Link from "next/link";

export default function SubscriptionModal() {
  const { isOpen, name, onOpen, onClose } = useModal();

  return (
    <Dialog open={isOpen && name === "SUBSCRIPTION"} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader className="hidden">
          <DialogTitle></DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <h1 className="text-2xl font-bold">Out of Credits?</h1>
        <p className="text-foreground/80">
          Upgrade to continue transforming your product photos instantly — no
          limits, no waiting.
        </p>

        <div>
          <h2 className="text-4xl font-semibold">
            <span className="text-sm">$</span>20
          </h2>
          <div className=" my-5 space-y-2 gap-4">
            <li className="list-none flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-green-600" /> Faster
              Processing
            </li>
            <li className="list-none flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-green-600" /> 1000 AI
              Credits
            </li>
            <li className="list-none flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-green-600" /> 30 Days
              Validity
            </li>
          </div>

          <div className="flex flex-col lg:flex-row items-center mt-10 gap-4">
            <Button className="  w-full lg:w-fit text-lg lg:text-base h-12 lg:h-10">
              <Crown className="" />
              Upgrade Now
            </Button>

            <Link
              href={`/pricing`}
            >
              <Button variant={"link"} className="">Pricing</Button>
            </Link>
          </div>
        </div>

        <DialogFooter className="mt-4">
          <div className="flex items-center justify-center w-full gap-5 text-xs text-muted-foreground font-extralight">
            <Link href={"/privacy"} className="hover:underline">
              Privacy Policy
            </Link>
            <Link href={"/terms"} className="hover:underline">
              Terms & Conditions
            </Link>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
