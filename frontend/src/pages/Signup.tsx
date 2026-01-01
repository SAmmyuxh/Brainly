import { Button } from "@/components/ui/button"
import { Brain, User, Lock, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Link, useNavigate } from "react-router-dom"
import { useRef, useState } from "react"
import { BACKEND_URL } from "@/config"
import axios from "axios"
import { AuthLayout } from "@/components/AuthLayout"

export function Signup() {
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    async function signup() {
        const username = usernameRef.current?.value;
        const password = passwordRef.current?.value;
        setError(null);
        setIsLoading(true);

        try {
            await axios.post(BACKEND_URL + "/api/v1/signup", {
                username,
                password
            });
            navigate("/signin");
        } catch (e: any) {
            if (e.response && e.response.data && e.response.data.message) {
                setError(e.response.data.message);
            } else {
                setError("Error while signing up");
            }
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <AuthLayout>
            <Card className="w-full max-w-md z-10 bg-white border border-gray-200 shadow-xl mx-4">
                <CardHeader className="space-y-4 text-center">
                    <div className="flex justify-center mb-2">
                        <div className="p-3 rounded-lg bg-indigo-600">
                            <Brain className="w-8 h-8 text-white" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <CardTitle className="text-3xl font-bold text-gray-900">
                            Join Brainly
                        </CardTitle>
                        <CardDescription className="text-gray-600 text-base">
                            Start building your second brain today
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    {error && (
                        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg text-center">
                            {error}
                        </div>
                    )}
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="username" className="text-gray-700">Username</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <Input
                                    id="username"
                                    ref={usernameRef}
                                    placeholder="Choose a username"
                                    className="pl-10 h-11 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-gray-700">Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <Input
                                    id="password"
                                    ref={passwordRef}
                                    type="password"
                                    placeholder="Create a password"
                                    onKeyDown={(e) => e.key === 'Enter' && signup()}
                                    className="pl-10 h-11 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>
                        </div>
                    </div>
                    <Button
                        onClick={signup}
                        disabled={isLoading}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-11 shadow-lg shadow-indigo-600/20 hover:shadow-xl hover:shadow-indigo-600/30 transition-all"
                    >
                        {isLoading ? (
                            <div className="flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Creating account...
                            </div>
                        ) : "Create Account"}
                    </Button>
                    <div className="text-center">
                        <p className="text-sm text-gray-600">
                            Already have an account?{" "}
                            <Link to="/signin" className="text-indigo-600 hover:text-indigo-700 font-medium hover:underline">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </CardContent>
            </Card>
        </AuthLayout>
    )
}
