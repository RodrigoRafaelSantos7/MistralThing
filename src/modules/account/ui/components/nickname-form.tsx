import { toast } from "sonner";
import z from "zod";
import { SingleFieldForm } from "@/components/app/single-field-form";
import { Input } from "@/components/ui/input";
import { useSettings } from "@/hooks/use-database";

const MIN_NICKNAME_LENGTH = 0;
const MAX_NICKNAME_LENGTH = 50;

const nicknameSchema = z.object({
  value: z
    .string()
    .min(MIN_NICKNAME_LENGTH, {
      message: `Nickname must be at least ${MIN_NICKNAME_LENGTH} characters`,
    })
    .max(MAX_NICKNAME_LENGTH, {
      message: `Nickname must be at most ${MAX_NICKNAME_LENGTH} characters`,
    }),
});

type NicknameFormProps = {
  defaultValue: string;
};

export function NicknameForm({ defaultValue }: NicknameFormProps) {
  const { updateSettings } = useSettings();

  return (
    <SingleFieldForm
      defaultValue={defaultValue}
      description="What do you want Mistral Thing to call you?"
      footerMessage="Please use 50 characters or less."
      label="Nickname"
      onSubmit={async (value) => {
        await updateSettings({ nickname: value });
        toast.success("Nickname saved");
      }}
      renderInput={({ onChange, value }) => (
        <Input
          className="border border-foreground/15 bg-muted/50 backdrop-blur-md"
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter your nickname"
          value={value}
        />
      )}
      schema={nicknameSchema}
    />
  );
}
