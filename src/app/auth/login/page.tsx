"use client";

import React, { useState } from "react";
import CloudNowLogo from "@/components/icons/CloudNowLogo";
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, MoreVertical } from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log("Login attempt:", { email, password });
  };

  return (
    <div className="min-h-screen w-full overflow-hidden bg-transparent">
      <BackgroundGradientAnimation
        gradientBackgroundStart="rgb(0, 0, 0)"
        gradientBackgroundEnd="rgb(0, 0, 0)"
        firstColor="0, 87, 130"
        secondColor="13, 83, 123"
        thirdColor="0, 50, 90"
        fourthColor="0, 30, 60"
        fifthColor="0, 20, 40"
        pointerColor="0, 87, 130"
        size="100%"
        blendingValue="hard-light"
        interactive={true}
      >
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            {/* Glassmorphism Login Form */}
            <div className="relative backdrop-blur-xl bg-black/30 border border-white/10 rounded-3xl p-8 shadow-2xl">
              {/* Subtle glow effect */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

              {/* Logo */}
              <div className="flex justify-center mb-6">
                <CloudNowLogo
                  width={200}
                  variant="white"
                  className="drop-shadow-lg"
                />
              </div>

              {/* Welcome Text */}
              <div className="text-center mb-8">
                <h2 className="text-xl font-semibold text-white mb-3">
                  Hey there! Welcome back to <br /> CloudNow Admin Portal
                </h2>
                <p className="text-gray-300 text-sm">
                  Sign in to manage the website and content
                </p>
              </div>

              {/* Login Form */}
              <form
                onSubmit={handleSubmit}
                className="space-y-6"
                autoComplete="off"
                spellCheck="false"
                data-lpignore="true"
              >
                {/* Hidden fields to confuse password managers */}
                <input type="text" style={{ display: "none" }} />
                <input type="password" style={{ display: "none" }} />
                {/* Email Field */}
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-white/90 text-sm font-medium"
                  >
                    Username or Email
                  </Label>
                  <div className="relative">
                    <Input
                      id="email"
                      name={
                        "usr_" + Math.random().toString(36).substring(2, 10)
                      }
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white/10 border-white/20 text-white placeholder-white/50 rounded-xl px-4 py-3 backdrop-blur-sm focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
                      placeholder="Enter your email"
                      autoComplete="chrome-off"
                      autoCorrect="off"
                      autoCapitalize="off"
                      data-lpignore="true"
                      aria-autocomplete="none"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/80 hover:bg-white/10"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label
                      htmlFor="password"
                      className="text-white/90 text-sm font-medium"
                    >
                      Password
                    </Label>
                    <button
                      type="button"
                      className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      name={
                        "pwd_" + Math.random().toString(36).substring(2, 10)
                      }
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-white/10 border-white/20 text-white placeholder-white/50 rounded-xl px-4 py-3 backdrop-blur-sm focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
                      placeholder="Enter your password"
                      autoComplete="chrome-off"
                      autoCorrect="off"
                      autoCapitalize="off"
                      data-lpignore="true"
                      aria-autocomplete="none"
                      readOnly
                      onFocus={(e) => e.target.removeAttribute("readonly")}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/80 hover:bg-white/10"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Sign In Button */}
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#005782] to-[#0d537b] hover:from-[#004a6f] hover:to-[#0b4a6b] text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
                >
                  Sign In
                </Button>
              </form>
            </div>
          </div>
        </div>
      </BackgroundGradientAnimation>
    </div>
  );
}
