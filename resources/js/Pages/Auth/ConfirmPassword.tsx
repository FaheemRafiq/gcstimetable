import { FormEventHandler, useState } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import { Eye, EyeOff, KeyRound, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import GuestLayout from "@/Layouts/GuestLayout";
import InputError from "@/Components/InputError";

export default function ConfirmPassword() {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        password: "",
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route("password.confirm"));
    };

    return (
        <GuestLayout>
            <Head title="Confirm Password" />

            <div className="w-full md:px-8 py-12 sm:max-w-md mx-auto">
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <ShieldCheck className="h-12 w-12 text-primary" />
                    </div>
                    <h1 className="text-2xl font-bold text-foreground">Confirm Password</h1>
                    <p className="text-muted-foreground mt-2">
                        This is a secure area. Please confirm your password before continuing.
                    </p>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={isPasswordVisible ? "text" : "password"}
                                name="password"
                                value={data.password}
                                className="pl-10 pr-10"
                                placeholder="Enter your password"
                                autoComplete="current-password"
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

                    <div className="flex flex-col gap-4">
                        <Button
                            className="w-full"
                            size="lg"
                            disabled={processing}
                        >
                            Confirm
                        </Button>

                        <Link
                            href={route("password.request")}
                            className="text-center text-sm text-primary hover:underline"
                        >
                            Forgot your password?
                        </Link>
                    </div>
                </form>

                <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground text-center">
                        For your security, please complete this confirmation step to continue.
                    </p>
                </div>
            </div>
        </GuestLayout>
    );
}