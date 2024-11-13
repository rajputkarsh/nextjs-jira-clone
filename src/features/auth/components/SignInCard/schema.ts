
import { z } from 'zod';

export interface ISignInForm {
  email: string;
  password: string;
}

export const SignInFormSchema = z.object({
  email: z.string().trim().min(1, "Required").email(),
  password: z.string().trim().min(1, "Required"),
});

export const SignInFormDefaultValues: ISignInForm = {
  email: "",
  password: "",
};