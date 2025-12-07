import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { setSessionEmail } from "@/lib/session";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { LOGIN_API_URL } from "@/shared/constants";
import { ClipLoader } from "react-spinners"
import { IoMdEyeOff, IoMdEye } from "react-icons/io";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [viewPassword, setViewPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
          setLoading(true)
          setError("")
          const response = await fetch(LOGIN_API_URL, {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
          })
          if (response.ok){
            // store the logged-in user's email in a client-side cookie (fallback)
            setSessionEmail(email);

            // Optionally, if the backend returned a JSON payload with user info,
            // you could read it here: const payload = await response.json();

            navigate("/");
          } else {
            setError("Invalid credentials")
          }
        } catch (error) {
            console.log(error)
        } finally {
          setLoading(false)
        }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md px-4">
        <Card>
          <CardHeader>
            <CardTitle>Sign in to Inventory</CardTitle>
            <CardDescription>Use your account to access the dashboard.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  required
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <div className="flex items-center relative">
                  <Input
                    id="password"
                    type={viewPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="mt-2"
                  />
                  <div onClick={() => setViewPassword(prev => !prev)} className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer">{viewPassword ? <IoMdEye /> : <IoMdEyeOff />}</div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                {/* <Link to="/" className="text-sm text-muted-foreground hover:underline">Forgot password?</Link> */}
                <p className="text-xs text-red-500 hover:underline">{error}</p>
              </div>

              <div>
                <Button type="submit" className="w-full">
                  {loading ? 
                    <ClipLoader
                      color={"white"}
                      loading={loading}
                      size={15}
                      aria-label="Loading Spinner"
                      data-testid="loader"
                    /> 
                    :
                    <p>Sign in</p>
                  }
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <div className="w-full text-center text-sm text-muted-foreground">
              New here? <Link to="/register" className="text-primary underline">Create an account</Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
