"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/auth-client";
import { accountPath, loginPath } from "@/lib/paths";

const Page = () => {
  const router = useRouter();
  return (
    <div>
      Hello World
      <Button
        onClick={() =>
          authClient.signOut().then(() => router.push(loginPath()))
        }
      >
        Logout
      </Button>
      <Link href={accountPath()}>Account</Link>
    </div>
  );
};

export default Page;
