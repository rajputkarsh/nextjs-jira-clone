import { useState } from "react";

import { Button, type ButtonProps } from "@/components/ui/button";
import ResponsiveModal from "@/components/responsive-modal";
import { Card, CardContent, CardTitle, CardHeader, CardDescription } from "@/components/ui/card";
import { useTranslations } from "next-intl";

function useConfirm(title: string, message: string, variant: ButtonProps['variant'] = 'primary'): [() => JSX.Element, () => Promise<unknown>] {
  const translations = useTranslations("ConfirmDialog");

  const [promise, setPromise] = useState<{ resolve: (value: boolean) => void } | null>(null);

  const confirm = () => {
    return new Promise((resolve) => {
      setPromise({ resolve });
    });
  }

  const handleClose = () => {
    setPromise(null);
  }

  const handleConfirm = () => {
    promise?.resolve(true);
    handleClose();
  };

  const handleCancel = () => {
    promise?.resolve(false);
    handleClose();
  };

  const ConfirmationDialog = () => {
    return (
      <ResponsiveModal open={promise !== null} onOpenChange={handleClose}>
        <Card className="w-full h-full border-none shadow-none">
          <CardContent className="pt-8">
            <CardHeader className="p-0">
              <CardTitle>{title}</CardTitle>
              <CardDescription>{message}</CardDescription>
            </CardHeader>
            <div className="pt-4 w-full flex flex-col lg:flex-row gap-y-2 gap-x-4 items-center justify-end">
              <Button
                onClick={handleCancel}
                variant={"outline"}
                className="w-full lg:w-auto"
              >
                {translations("cancel")}
              </Button>
              <Button
                onClick={handleConfirm}
                variant={variant}
                className="w-full lg:w-auto"
              >
                {translations("confirm")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </ResponsiveModal>
    );
  }

  return [ConfirmationDialog, confirm];
}

export default useConfirm;