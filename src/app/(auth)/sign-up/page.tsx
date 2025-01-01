
import { redirect } from "next/navigation";
import { getCurrent } from "@/features/auth/queries";
import { SignUpCard } from "@/features/auth/components/SignUpCard";

async function SignUp() {
  const user = await getCurrent();

  if(user) {
    redirect('/');
  }

  return <SignUpCard />;
}

export default SignUp;
