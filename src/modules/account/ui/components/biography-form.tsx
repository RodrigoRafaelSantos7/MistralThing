import { toast } from "sonner";
import z from "zod";
import { SingleFieldForm } from "@/components/app/single-field-form";
import { Textarea } from "@/components/ui/textarea";
import { useSettings } from "@/hooks/use-database";

const MIN_BIOGRAPHY_LENGTH = 0;
const MAX_BIOGRAPHY_LENGTH = 500;

const biographySchema = z.object({
  value: z
    .string()
    .min(MIN_BIOGRAPHY_LENGTH, {
      message: `Biography must be at least ${MIN_BIOGRAPHY_LENGTH} characters`,
    })
    .max(MAX_BIOGRAPHY_LENGTH, {
      message: `Biography must be at most ${MAX_BIOGRAPHY_LENGTH} characters`,
    }),
});

type BiographyFormProps = {
  defaultValue: string;
};

export function BiographyForm({ defaultValue }: BiographyFormProps) {
  const { updateSettings } = useSettings();
  return (
    <SingleFieldForm
      defaultValue={defaultValue}
      description="What should Mistral Thing know about you?"
      footerMessage={`Please use ${MAX_BIOGRAPHY_LENGTH} characters or less.`}
      label="Biography"
      onSubmit={async (value) => {
        await updateSettings({ biography: value });
        toast.success("Biography saved");
      }}
      renderInput={({ onChange, value }) => (
        <Textarea
          className="resize-none border border-foreground/15 bg-muted/50 backdrop-blur-md"
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter your biography"
          rows={5}
          value={value}
        />
      )}
      schema={biographySchema}
    />
  );
}
