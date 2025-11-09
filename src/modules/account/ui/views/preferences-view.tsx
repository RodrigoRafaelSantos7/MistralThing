"use client";

import { toast } from "sonner";
import z from "zod";
import { SingleFieldForm } from "@/components/app/single-field-form";
import { Section } from "@/components/ui/section";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useSettings } from "@/hooks/use-database";
import { NicknameForm } from "@/modules/account/ui/components/nickname-form";

const MIN_INSTRUCTIONS_LENGTH = 0;

const MAX_INSTRUCTIONS_LENGTH = 1000;

const instructionsSchema = z.object({
  value: z
    .string()
    .min(MIN_INSTRUCTIONS_LENGTH, {
      message: `Instructions must be at least ${MIN_INSTRUCTIONS_LENGTH} characters`,
    })
    .max(MAX_INSTRUCTIONS_LENGTH, {
      message: `Instructions must be at most ${MAX_INSTRUCTIONS_LENGTH} characters`,
    }),
});

const PreferencesView = () => {
  const { settings, updateSettings } = useSettings();

  if (!settings) {
    return null;
  }

  return (
    <div className="flex flex-col gap-8">
      <Section
        description="Customize your preferences here."
        title="Preferences"
      >
        <NicknameForm defaultValue={settings.nickname ?? ""} />
      </Section>

      <Separator />

      <Section description="Customize your system prompt here." title="System">
        <SingleFieldForm
          defaultValue={settings.instructions ?? ""}
          description="How do you want Mistral to behave?"
          footerMessage="Please use 1000 characters or less."
          label="Instructions"
          onSubmit={async (value) => {
            await updateSettings({ instructions: value });
            toast.success("Instructions saved");
          }}
          renderInput={({ onChange, value }) => (
            <Textarea
              className="resize-none border border-foreground/15 bg-muted/50 backdrop-blur-md"
              onChange={(e) => onChange(e.target.value)}
              placeholder="Enter your instructions"
              rows={5}
              value={value}
            />
          )}
          schema={instructionsSchema}
        />
      </Section>
    </div>
  );
};

export { PreferencesView };
