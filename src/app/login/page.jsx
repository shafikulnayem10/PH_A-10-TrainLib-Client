"use client";

import { authClient } from "@/lib/auth-client";
import {
  Button,
  Card,
  Description,
  FieldError,
  Form,
  Input,
  Label,
  TextField,
} from "@heroui/react";
import { GrGoogle } from "react-icons/gr";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();

  const onSubmit = async (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;

    const { data, error } = await authClient.signIn.email({
      email,
      password,
    });

    if (error) {
      toast.error(error.message || "Login failed. Please check your credentials.");
    } else {
      toast.success("Welcome back!");
      
      router.push("/"); 
      router.refresh();
    }
  };

  const handleGoogleLogIn = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/", 
      });
      toast.success("Welcome!");
    } catch (err) {
      toast.error("Google sign-in failed.");
    }
  };

  const uiInputStyles = {
    input: "text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 font-medium",
    inputWrapper: [
      "bg-white dark:bg-slate-950",
      "border border-slate-200 dark:border-slate-800",
      "hover:border-slate-300 dark:hover:border-slate-700",
      "focus-within:!border-blue-600 dark:focus-within:!border-blue-500",
      "rounded-xl transition-all duration-200"
    ].join(" ")
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] bg-slate-50/50 dark:bg-slate-950 px-4 text-slate-900 dark:text-white transition-colors duration-300">
      <Toaster position="top-center" reverseOrder={false} />

      {/* Login Card Container */}
      <Card className="border border-slate-100 dark:border-slate-800 shadow-xl w-full max-w-md py-10 px-8 flex flex-col gap-6 rounded-3xl bg-white dark:bg-slate-900 shadow-none">
        
        {/* Title */}
        <div className="text-center space-y-2">
        
         <h1 className="text-3xl font-black !text-slate-900 dark:!text-white tracking-tight">
  WEL<span className="text-blue-600">COME</span>
</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
            Please enter your details to login to TrainLib.
          </p>
        </div>

        {/* Credentials Login Form */}
        <Form className="flex flex-col gap-5" onSubmit={onSubmit}>
          
          {/* Email Input */}
          <TextField
            isRequired
            name="email"
            type="email"
            className="w-full"
            validate={(value) => {
              if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
                return "Please enter a valid email address";
              }
              return null;
            }}
          >
            <Label className="text-sm font-extrabold text-slate-700 dark:text-slate-200 mb-1 block">Email Address</Label>
            <Input 
              placeholder="name@example.com" 
              classNames={uiInputStyles}
            />
            <FieldError className="text-xs text-red-500 mt-1 font-semibold" />
          </TextField>

          {/* Password Input */}
          <TextField
            isRequired
            name="password"
            type="password"
            className="w-full"
          >
            <Label className="text-sm font-extrabold text-slate-700 dark:text-slate-200 mb-1 block">Password</Label>
            <Input 
              type="password"
              placeholder="*********"
              classNames={uiInputStyles}
            />
            <Description className="text-[10px] text-slate-400 dark:text-slate-500 font-medium mt-1">
              Must be at least 6 characters.
            </Description>
            <FieldError className="text-xs text-red-500 mt-1 font-semibold" />
          </TextField>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold h-12 rounded-xl shadow-md shadow-blue-600/10 transition-all duration-300 text-sm"
          >
            Login
          </Button>
        </Form>

        {/* Divider Section */}
        <div className="flex items-center gap-4 py-1">
          <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1"></div>
          <span className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Or</span>
          <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1"></div>
        </div>

        {/* Social Authentication Button */}
        <Button
          onClick={handleGoogleLogIn}
          variant="bordered"
          className="w-full border-blue-600 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 font-extrabold h-12 rounded-xl transition-all duration-300 text-sm"
        >
          <GrGoogle className="text-blue-600 dark:text-blue-400 text-lg" />
          Continue with Google
        </Button>

        {/* Footer Link */}
        <p className="text-center text-sm text-slate-600 dark:text-slate-400 font-medium">
          New to TrainLib?{" "}
          <Link href="/register" className="text-blue-600 font-extrabold hover:text-blue-700 dark:hover:text-blue-400 hover:underline transition-colors">
            Create an account
          </Link>
        </p>
      </Card>
    </div>
  );
}