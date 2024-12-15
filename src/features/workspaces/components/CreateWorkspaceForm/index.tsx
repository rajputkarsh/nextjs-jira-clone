'use client';

import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { createWorkspaceFormDefaultValues, createWorkspaceSchema } from "../../schema";
import { DottedSeparator } from "@/components/dotter-separator";


interface ICreateWorkspaceFormProps {
  onCancel?: () => void;
}

function CreateWorkSpaceForm({ onCancel }: ICreateWorkspaceFormProps) {
  const translations = useTranslations("CreateWorkspaceForm");

  const form = useForm<z.infer<typeof createWorkspaceSchema>>({
    resolver: zodResolver(createWorkspaceSchema),
    defaultValues: createWorkspaceFormDefaultValues,
  });

  const onSubmit = (values: z.infer<typeof createWorkspaceSchema>) => {
    console.log({values});
  };

  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="flex p-7">
        <CardTitle className="text-xl font-bold">
          {translations("create_new_workspace")}
        </CardTitle>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator  />
      </div>
      <CardContent className="p-7">

      </CardContent>
    </Card>
  );
}

export default CreateWorkSpaceForm;
