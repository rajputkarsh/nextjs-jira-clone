'use client';

import { ChangeEvent, useRef } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
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
import { updateWorkspaceSchema } from "@/features/workspaces/schema";
import { DottedSeparator } from "@/components/dotter-separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUpdateWorkspace } from "@/features/workspaces/api/use-updateWorkspace";
import { ArrowLeftIcon, CopyIcon, ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Workspace } from "@/features/workspaces/types";
import useConfirm from "@/hooks/use-confirm";
import { useDeleteWorkspace } from "../../api/use-deleteWorkspace";
import { useResetInviteCode } from "../../api/use-ResetInviteCode";

interface IUpdateWorkspaceFormProps {
  onCancel?: () => void;
  initialValues: Workspace
}

function UpdateWorkSpaceForm({
  onCancel,
  initialValues,
}: IUpdateWorkspaceFormProps) {
  const translations = useTranslations("UpdateWorkspaceForm");
  const [DeleteDialog, confirmDelete] = useConfirm(
    translations("delete_workspace"),
    translations("this_action_cannot_be_undone"),
    "destructive"
  );
  const [ResetDialog, confirmReset] = useConfirm(
    translations("reset_invite_link"),
    translations("this_will_invalidate_current_invite_code"),
    "destructive"
  );
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { mutate, isPending } = useUpdateWorkspace();
  const {mutate: deleteWorkspace, isPending: isDeleteWorkspacePending} = useDeleteWorkspace();
  const {mutate: resetInviteCode, isPending: isResetInviteCodePending} = useResetInviteCode();


  const fullInviteLink = `${window.location.origin}/workspaces/${initialValues.$id}/join/${initialValues.inviteCode}`;

  const form = useForm<z.infer<typeof updateWorkspaceSchema>>({
    resolver: zodResolver(updateWorkspaceSchema),
    defaultValues: {
      name: initialValues.name,
      image: initialValues.imageUrl ?? "",
    },
  });

  const onSubmit = (values: z.infer<typeof updateWorkspaceSchema>) => {
    mutate(
      {
        param: {
          workspaceId: initialValues.$id,
        },
        form: {
          ...values,
          image: values.image instanceof File ? values.image : "",
        },
      },
      {
        onSuccess: ({ data }) => {
          form.reset();
          router.push(`/workspaces/${data?.$id}`);
        },
      }
    );
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      form.setValue("image", file);
    }
  };

  const handleDelete = async () => {
    const ok = await confirmDelete();
    if(!ok) return;

    deleteWorkspace({
      param: {
        workspaceId: initialValues.$id
      }
    }, {
      onSuccess: () => {
        window.location.href = "/";
      }
    });
  }

  const handleResetInviteCode = async () => {
    const ok = await confirmReset();
    if (!ok) return;

    resetInviteCode(
      {
        param: {
          workspaceId: initialValues.$id,
        },
      },
      {
        onSuccess: () => {
          router.refresh();
        },
      }
    );    
  }

  const handleCopyInviteLink = () => {
    navigator.clipboard.writeText(fullInviteLink)
      .then(() => {
        toast.success(translations("invite_link_copied"));
      });
  };

  return (
    <div className="flex flex-col gap-y-4">
      <DeleteDialog />
      <ResetDialog />
      <Card className="w-full h-full border-none shadow-none">
        <CardHeader className="flex flex-row items-center justify-between gap-x-4 p-7 space-y-0">
          <CardTitle className="text-xl font-bold">
            {initialValues.name}
          </CardTitle>
          <Button
            size={"sm"}
            variant={"secondary"}
            onClick={
              onCancel
                ? onCancel
                : () => router.push(`/workspaces/${initialValues.$id}`)
            }
          >
            <ArrowLeftIcon className="size-4" />
            {translations("back")}
          </Button>
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
                        <FormLabel>{translations("workspace")}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={translations("workspace_placeholder")}
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
                        <p className="text-sm">
                          {translations("workspace_icon")}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {translations("jpg_png_svg_gif_or_jpeg_max_1_mb")}
                        </p>
                        <input
                          className="hidden"
                          accept=".jpg, .png, .jpeg, .svg, .gif"
                          type="file"
                          ref={inputRef}
                          disabled={
                            isPending ||
                            isDeleteWorkspacePending ||
                            isResetInviteCodePending
                          }
                          onChange={handleImageChange}
                        />
                        {field.value ? (
                          <Button
                            type="button"
                            size="xs"
                            variant="destructive"
                            className="w-fit mt-2"
                            disabled={
                              isPending ||
                              isDeleteWorkspacePending ||
                              isResetInviteCodePending
                            }
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
                            disabled={
                              isPending ||
                              isDeleteWorkspacePending ||
                              isResetInviteCodePending
                            }
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
                  disabled={
                    isPending ||
                    isDeleteWorkspacePending ||
                    isResetInviteCodePending
                  }
                  onClick={onCancel}
                  className={cn(!!onCancel ? "" : "invisible")}
                >
                  {translations("cancel")}
                </Button>
                <Button
                  type="submit"
                  size="lg"
                  variant="primary"
                  disabled={
                    isPending ||
                    isDeleteWorkspacePending ||
                    isResetInviteCodePending
                  }
                >
                  {translations("save_changes")}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <Card className="w-full h-full border-none shadow-none">
        <CardContent className="p-7">
          <div className="flex flex-col">
            <h3 className="font-bold">{translations("invite_members")}</h3>
            <p className="text-sm text-muted-foreground">
              {translations("use_invite_link_to_add_members_to_your_workspace")}
            </p>
            <div className="mt-4">
              <div className="flex items-center gap-x-2">
                <Input disabled value={fullInviteLink} />
                <Button
                  onClick={handleCopyInviteLink}
                  variant={"secondary"}
                  className="size-12"
                >
                  <CopyIcon className="size-5" />
                </Button>
              </div>
            </div>
            <DottedSeparator className="py-7" />
            <Button
              className="mt-6 w-fit ml-auto"
              size={"sm"}
              variant={"destructive"}
              type="button"
              disabled={
                isPending ||
                isDeleteWorkspacePending ||
                isResetInviteCodePending
              }
              onClick={handleResetInviteCode}
            >
              {translations("reset_invite_link")}
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card className="w-full h-full border-none shadow-none">
        <CardContent className="p-7">
          <div className="flex flex-col">
            <h3 className="font-bold">{translations("danger_zone")}</h3>
            <p className="text-sm text-muted-foreground">
              {translations(
                "deleting_a_workspace_is_irreversible_and_will_delete_all_associated_data"
              )}
            </p>
            <DottedSeparator className="py-7" />
            <Button
              className="mt-6 w-fit ml-auto"
              size={"sm"}
              variant={"destructive"}
              type="button"
              disabled={
                isPending ||
                isDeleteWorkspacePending ||
                isResetInviteCodePending
              }
              onClick={handleDelete}
            >
              {translations("delete_workspace")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default UpdateWorkSpaceForm;
