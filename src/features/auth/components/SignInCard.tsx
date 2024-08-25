import { useState } from "react";
import { AuthFlow } from "../types";

import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

import { 
    Card, 
    CardTitle,
    CardHeader,
    CardContent, 
    CardDescription,   
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface SignInCardProps {
    setState: (state: AuthFlow) => void;
}

export const SignInCard = ({ setState }: SignInCardProps) => {
    const [account, setAccount] = useState({
        email: "",
        password: ""
    });


    return (
        <Card className="w-full h-full p-8">
            <CardHeader className="px-0 pt-0">
                <CardTitle>
                    Login to continue
                </CardTitle>
                <CardDescription>
                    Use your email or another provider to login
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5 px-0 pb-0">
            <aside className="flex flex-col gap-y-2.5">
                    <Button
                        size="sm"
                        disabled={false}
                        onClick={() => { }}
                        variant="outline"
                        className="w-full relative"
                    >
                        <FcGoogle className="size-5 absolute top-2 left-2.5" />
                        Continue with Google
                    </Button>
                    <Button
                        size="sm"
                        disabled={false}
                        onClick={() => { }}
                        variant="outline"
                        className="w-full relative"
                    >
                        <FaGithub className="size-5 absolute top-2 left-2.5" />
                        Continue with GitHub
                    </Button>
                </aside>

                <Separator className="my-2" />

                <form className="space-y-4">
                    <fieldset>
                        <label htmlFor="email" className="text-sm font-medium text-neutral-700">Email</label>
                        <Input
                            required
                            id="email"
                            name="email"
                            type="email"
                            disabled={false}
                            value={account.email}
                            placeholder="Enter your email"
                            onChange={(e) => setAccount({ ...account, email: e.target.value })}
                        />
                    </fieldset>
                    <fieldset>
                        <label htmlFor="password" className="text-sm font-medium text-neutral-700">Password</label>
                        <Input
                            required
                            id="password"
                            type="password"
                            name="password"
                            disabled={false}
                            value={account.password}
                            placeholder="Enter your password"
                            onChange={(e) => setAccount({ ...account, password: e.target.value })}
                        />
                    </fieldset>
                    <Button
                        size="sm"
                        type="submit"
                        disabled={false}
                        className="w-full"
                    >
                        Continue with email
                    </Button>
                </form>
                <p className="text-xs text-center text-neutral-500">
                    Don&apos;t have an account?{" "} 
                    <span 
                        onClick={() => setState("signUp")}
                        className="text-sky-700 hover:underline cursor-pointer"
                    >
                        Sign up
                    </span>
                </p>
            </CardContent>
        </Card>
    );
};