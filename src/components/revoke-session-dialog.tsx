import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { authClient } from "@/lib/auth/auth-client";

const RevokeSessionDialog = ({
  children,
  token,
}: {
  children: React.ReactNode;
  token: string;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Revoke Session</DialogTitle>
          <DialogDescription>
            Are you sure you want to revoke this session?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={() => setOpen(false)} variant="outline">
            Cancel
          </Button>
          <Button
            onClick={async () => {
              await toast
                .promise(authClient.revokeSession({ token }), {
                  loading: "Revoking session...",
                  success: "Session revoked successfully",
                  error: "Failed to revoke session",
                })
                .unwrap()
                .then(() => setOpen(false));
            }}
            variant="destructive"
          >
            Revoke
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export { RevokeSessionDialog };
