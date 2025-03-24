import { z } from "zod";
import { PASSWORD_REGEX } from "@/constants/regex";

// SignIn Schemas
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

// SignUp Schemas
export interface ISignUpForm {
  name: string;
  email: string;
  password: string;
}

export const SignUpFormSchema = z.object({
  name: z.string().trim().min(1, "Required"),
  email: z.string().trim().min(1, "Required").email(),
  password: z
    .string()
    .trim()
    .min(1, "Required")
    .regex(
      PASSWORD_REGEX,
      "Password must be at least 8 characters including an uppercase letter, a lowercase letter, a number, & a special character."
    ),
});

export const SignUpFormDefaultValues: ISignUpForm = {
  name: "",
  email: "",
  password: "",
};
