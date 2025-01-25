"use client";
import { ChangeEvent, useRef } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  createProjectFormDefaultValues,
  createProjectSchema,
} from "@/features/projects/schema";
import { DottedSeparator } from "@/components/dotter-separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCreateProject } from "@/features/projects/api/use-createProject";
import { ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspaceId";

interface ICreateProjectFormProps {
  onCancel?: () => void;
}

function CreateProjectForm({ onCancel }: ICreateProjectFormProps) {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { mutate, isPending } = useCreateProject();
  const translations = useTranslations("CreateProjectForm");

  const form = useForm<z.infer<typeof createProjectSchema>>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: createProjectFormDefaultValues,
  });

  const onSubmit = (values: z.infer<typeof createProjectSchema>) => {

    mutate(
      {
        form: {
          ...values,
          image: values.image instanceof File ? values.image : "",
          workspaceId,
        },
      },
      {
        onSuccess: ({ data }) => {
          form.reset();
          router.push(`/workspaces/${workspaceId}/projects/${data?.$id}`);
        },
      }
    );
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if(file) {
      form.setValue("image", file)
    }
  }

  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="flex p-7">
        <CardTitle className="text-xl font-bold">
          {translations("create_new_project")}
        </CardTitle>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>{translations("project")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={translations("project_placeholder")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <div className="flex gap-y-2 gap-x-5">
                    <div className="flex items-center gap-x-5">
                      {field.value ? (
                        <div className="size-[72px] relative rounded-md overflow-hidden">
                          <Image
                            alt="Logo"
                            fill
                            className="object-cover"
                            src={
                              field.value instanceof File
                                ? URL.createObjectURL(field.value)
                                : field.value
                            }
                          />
                        </div>
                      ) : (
                        <Avatar className="size-[72px]">
                          <AvatarFallback>
                            <ImageIcon className="size-[36px] text-neutral-400" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <p className="text-sm">{translations("project_icon")}</p>
                      <p className="text-sm text-muted-foreground">
                        {translations("jpg_png_svg_gif_or_jpeg_max_1_mb")}
                      </p>
                      <input
                        className="hidden"
                        accept=".jpg, .png, .jpeg, .svg, .gif"
                        type="file"
                        ref={inputRef}
                        disabled={isPending}
                        onChange={handleImageChange}
                      />
                      {field.value ? (
                        <Button
                          type="button"
                          size="xs"
                          variant="destructive"
                          className="w-fit mt-2"
                          disabled={isPending}
                          onClick={() => {
                            field.onChange(null);
                            if (inputRef.current) {
                              inputRef.current.value = "";
                            }
                          }}
                        >
                          {translations("remove_image")}
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          size="xs"
                          variant="tertiary"
                          className="w-fit mt-2"
                          disabled={isPending}
                          onClick={() => {
                            inputRef.current?.click();
                          }}
                        >
                          {translations("upload_image")}
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              />
            </div>
            <DottedSeparator className="py-7" />
            <div className="flex items-center justify-between">
              <Button
                type="button"
                size="lg"
                variant="secondary"
                disabled={isPending}
                onClick={onCancel}
                className={cn(!!onCancel ? "" : "invisible")}
              >
                {translations("cancel")}
              </Button>
              <Button
                type="submit"
                size="lg"
                variant="primary"
                disabled={isPending}
              >
                {translations("create_project")}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default CreateProjectForm;
