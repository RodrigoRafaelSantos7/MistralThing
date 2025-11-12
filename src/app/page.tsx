"use client";

import { Authenticated, Unauthenticated } from "convex/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export default function Home() {
  const router = useRouter();
  return (
    <>
      <Authenticated>
        <div>
          <h1>Hello World</h1>
          <Button
            onClick={() =>
              authClient.signOut({
                fetchOptions: {
                  onSuccess: () => router.push("/logged-out"),
                },
              })
            }
          >
            Logout
          </Button>
        </div>
      </Authenticated>
      <Unauthenticated>
        <div>
          <h1>Hello World (Unauthenticated)</h1>
        </div>
      </Unauthenticated>
    </>
  );
}
