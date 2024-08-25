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


interface SignUpCardProps {
    setState: (state: AuthFlow) => void;
}

export const SignUpCard = ({ setState }: SignUpCardProps) => {
    return (
        <Card className="w-full h-full p-8">
            <CardHeader className="px-0 pt-0">
                <CardTitle>
                  Sign up to continue
                </CardTitle>
                <CardDescription>
                    Use your email or another provider to continue
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
                        <FcGoogle className="size-5 absolute top-3 left-2.5" />
                        Continue with Google
                    </Button>
                    <Button
                        size="sm"
                        disabled={false}
                        onClick={() => { }}
                        variant="outline"
                        className="w-full relative"
                    >
                        <FaGithub className="size-5 absolute top-3 left-2.5" />
                        Continue with GitHub
                    </Button>
                </aside>

                <Separator className="my-2" />

                <form className="space-y-4">
                    <fieldset>
                        <label htmlFor="email" className="text-sm font-medium text-neutral-700">Email</label>
                        <Input
                            id="email"
                            name="email"
                            required
                            type="email"
                            value=""
                            disabled={false}
                            placeholder="Enter your email"
                            onChange={() => { }}
                        />
                    </fieldset>
                    <fieldset>
                        <label htmlFor="password" className="text-sm font-medium text-neutral-700">Password</label>
                        <Input
                            id="password"
                            name="password"
                            required
                            type="password"
                            value=""
                            disabled={false}
                            placeholder="Enter your password"
                            onChange={() => { }}
                        />
                    </fieldset>
                    <fieldset>
                        <label htmlFor="confirm-password" className="text-sm font-medium text-neutral-700">Confirm Password</label>
                        <Input
                            id="confirm-password"
                            name="confirm-password"
                            required
                            type="password"
                            value=""
                            disabled={false}
                            placeholder="Confirm your password"
                            onChange={() => { }}
                        />
                    </fieldset>
                    <Button
                        size="sm"
                        type="submit"
                        disabled={false}
                        className="w-full"
                    >
                        Create account
                    </Button>
                </form>
                <p className="text-xs text-center text-neutral-500">
                    Already have an account? 
                    <span 
                        onClick={() => setState("signIn")}
                        className="text-sky-700 hover:underline cursor-pointer"
                    >
                        Sign in
                    </span>
                </p>
            </CardContent>
        </Card>
    );
};