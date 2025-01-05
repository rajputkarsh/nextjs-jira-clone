'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { useTranslations } from 'next-intl';

interface JoinWorkspaceFormProps {
  initialValues: {
    name: string;
  }
}

function JoinWorkspaceForm({ initialValues }: JoinWorkspaceFormProps) {
  const translations = useTranslations("JoinWorkspaceForm");

  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="p-7">
        <CardTitle className="text-xl font-bold">
          {translations("join_workspace")}
        </CardTitle>
        <CardDescription>
          <span
            dangerouslySetInnerHTML={{
              __html: translations("youve_been_invited_to_join_workspace", {
                name: `<strong>${initialValues.name}</strong>`,
              }),
            }}
          />
        </CardDescription>
      </CardHeader>
    </Card>
  );
}

export default JoinWorkspaceForm