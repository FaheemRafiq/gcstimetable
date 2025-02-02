import { FormEventHandler, useState } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import { Eye, EyeOff, UserRound, KeyRound, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import GuestLayout from "@/Layouts/GuestLayout";
import InputError from "@/Components/InputError";

export default function Register() {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route("register"), {
            onFinish: () => reset("password", "password_confirmation"),
        });
    };

    return (
        <GuestLayout>
            <Head title="Register" />

            <div className="w-full md:px-8 py-12 sm:max-w-md mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-foreground">Create Account</h1>
                    <p className="text-muted-foreground mt-2">Join us and start organizing your time</p>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <div className="relative">
                            <Input
                                id="name"
                                name="name"
                                value={data.name}
                                className="pl-10"
                                placeholder="Enter your full name"
                                autoComplete="name"
                                onChange={(e) => setData("name", e.target.value)}
                                required
                            />
                            <UserRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        </div>
                        <InputError message={errors.name} className="mt-1" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <div className="relative">
                            <Input
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="pl-10"
                                placeholder="Enter your email"
                                autoComplete="username"
                                onChange={(e) => setData("email", e.target.value)}
                                required
                            />
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        </div>
                        <InputError message={errors.email} className="mt-1" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={isPasswordVisible ? "text" : "password"}
                                name="password"
                                value={data.password}
                                className="pl-10 pr-10"
                                placeholder="Create a password"
                                autoComplete="new-password"
                                onChange={(e) => setData("password", e.target.value)}
                                required
                            />
                            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <button
                                type="button"
                                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                aria-label={isPasswordVisible ? "Hide password" : "Show password"}
                            >
                                {isPasswordVisible ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </button>
                        </div>
                        <InputError message={errors.password} className="mt-1" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password_confirmation">Confirm Password</Label>
                        <div className="relative">
                            <Input
                                id="password_confirmation"
                                type={isConfirmPasswordVisible ? "text" : "password"}
                                name="password_confirmation"
                                value={data.password_confirmation}
                                className="pl-10 pr-10"
                                placeholder="Confirm your password"
                                autoComplete="new-password"
                                onChange={(e) => setData("password_confirmation", e.target.value)}
                                required
                            />
                            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <button
                                type="button"
                                onClick={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                aria-label={isConfirmPasswordVisible ? "Hide password" : "Show password"}
                            >
                                {isConfirmPasswordVisible ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </button>
                        </div>
                        <InputError message={errors.password_confirmation} className="mt-1" />
                    </div>

                    <Button
                        className="w-full"
                        size="lg"
                        disabled={processing}
                    >
                        Create Account
                    </Button>

                    <div className="text-center text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <Link
                            href={route("login")}
                            className="text-primary hover:underline"
                        >
                            Sign in
                        </Link>
                    </div>
                </form>
            </div>
        </GuestLayout>
    );
}