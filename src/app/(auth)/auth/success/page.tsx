import { User } from "@/generated/prisma";
import { createUser } from "@/queries/db";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { v4 } from "uuid";

interface SearchParams {
  success_redirect?: string;
  failure_redirect?: string;
}

export default async function AuthSuccessPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const success_redirect = params.success_redirect || "/";

  const failure_redirect = params.failure_redirect || "/";

  const user = await currentUser();

  if (!user) return redirect(failure_redirect);

  // Create new user in DB

  const userData: User = {
    id: v4(),
    name: user.fullName || "",
    email: user.emailAddresses[0].emailAddress,
    avatar: user.imageUrl,
    user_id: user.id,
    phone: user.phoneNumbers[0]?.phoneNumber,
    has_subscription: false,
    credits: 20,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  try {
    const dbUser = await createUser(userData);
  } catch (error) {
    console.log(error);
    return redirect(failure_redirect);
  }

  return redirect(success_redirect);
}
