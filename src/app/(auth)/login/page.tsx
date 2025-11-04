"use client";

import React, { useState } from "react";
import CloudNowLogo from "@/components/icons/CloudNowLogo";
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, MoreVertical } from "lucide-react";
import { useLogin } from "../_hooks/mutations/use-login";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const loginMutation = useLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await loginMutation.mutateAsync({ email, password });
    } catch (err) {
      // Error is handled by the mutation's onError if needed
      // For now, we'll show it in the UI via the error state
    }
  };

  const error = loginMutation.error
    ? (loginMutation.error as Error).message
    : null;
  const isLoading = loginMutation.isPending;

  return (
    <div className="min-h-screen w-full overflow-hidden bg-transparent">
      <BackgroundGradientAnimation
        gradientBackgroundStart="rgb(255, 255, 255)"
        gradientBackgroundEnd="rgb(240, 248, 255)"
        firstColor="135, 206, 250"
        secondColor="100, 181, 246"
        thirdColor="66, 165, 245"
        fourthColor="30, 144, 255"
        fifthColor="0, 87, 130"
        pointerColor="66, 165, 245"
        size="100%"
        blendingValue="soft-light"
        interactive={true}
      >
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            {/* Glassmorphism Login Form */}
            <div className="relative backdrop-blur-2xl bg-white/30 border border-white/40 rounded-3xl p-8 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] overflow-hidden">
              {/* Gradient border overlay */}
              <div className="absolute inset-0 rounded-3xl border border-white/50 pointer-events-none" />

              {/* Animated gradient border */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/60 via-blue-100/40 to-white/20 pointer-events-none" />

              {/* Glass reflection effect */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/30 via-transparent to-transparent pointer-events-none" />

              {/* Outer glow/halo effect */}
              <div className="absolute -inset-0.5 rounded-3xl bg-gradient-to-r from-blue-300/30 via-blue-200/20 to-blue-100/10 blur-2xl opacity-60 pointer-events-none" />

              {/* Content wrapper with relative positioning */}
              <div className="relative z-10">
                {/* Logo */}
                <div className="flex justify-center mb-6">
                  <CloudNowLogo
                    width={200}
                    variant="default"
                    className="drop-shadow-lg"
                  />
                </div>

                {/* Welcome Text */}
                <div className="text-center mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">
                    Hey there! Welcome back to <br /> CloudNow Admin Portal
                  </h2>
                  <p className="text-gray-600 text-sm">
                    Sign in to manage the website and content
                  </p>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="mb-6 rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

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
                      className="text-gray-700 text-sm font-medium"
                    >
                      Username or Email
                    </Label>
                    <div className="relative group">
                      {/* Glassmorphism input container */}
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/40 via-white/20 to-blue-50/30 backdrop-blur-sm border border-white/50 shadow-inner pointer-events-none group-hover:border-white/70 transition-all duration-300" />
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-blue-100/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                      <Input
                        id="email"
                        name={
                          "usr_" + Math.random().toString(36).substring(2, 10)
                        }
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="relative w-full bg-white/20 backdrop-blur-md border-0 text-gray-900 placeholder-gray-500/70 rounded-xl px-5 py-6 text-base focus:ring-2 focus:ring-white/50 focus:bg-white/30 focus:outline-none focus:shadow-[0_0_20px_rgba(66,165,245,0.3)] transition-all duration-300 shadow-sm"
                        placeholder="Enter your email"
                        autoComplete="chrome-off"
                        autoCorrect="off"
                        autoCapitalize="off"
                        data-lpignore="true"
                        aria-autocomplete="none"
                        disabled={isLoading}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500/70 hover:text-gray-700 hover:bg-white/30 backdrop-blur-sm rounded-lg transition-all duration-200"
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
                        className="text-gray-700 text-sm font-medium"
                      >
                        Password
                      </Label>
                      <button
                        type="button"
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative group">
                      {/* Glassmorphism input container */}
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/40 via-white/20 to-blue-50/30 backdrop-blur-sm border border-white/50 shadow-inner pointer-events-none group-hover:border-white/70 transition-all duration-300" />
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-blue-100/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                      <Input
                        id="password"
                        name={
                          "pwd_" + Math.random().toString(36).substring(2, 10)
                        }
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="relative w-full bg-white/20 backdrop-blur-md border-0 text-gray-900 placeholder-gray-500/70 rounded-xl px-5 py-6 text-base focus:ring-2 focus:ring-white/50 focus:bg-white/30 focus:outline-none focus:shadow-[0_0_20px_rgba(66,165,245,0.3)] transition-all duration-300 shadow-sm"
                        placeholder="Enter your password"
                        autoComplete="chrome-off"
                        autoCorrect="off"
                        autoCapitalize="off"
                        data-lpignore="true"
                        aria-autocomplete="none"
                        readOnly
                        onFocus={(e) => e.target.removeAttribute("readonly")}
                        disabled={isLoading}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500/70 hover:text-gray-700 hover:bg-white/30 backdrop-blur-sm rounded-lg transition-all duration-200"
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
                  <div className="relative group">
                    {/* Outer glow effect */}
                    <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-blue-400/40 via-blue-500/50 to-blue-600/40 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Glassmorphism overlay */}
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 via-white/10 to-transparent backdrop-blur-sm pointer-events-none" />

                    {/* Animated gradient border */}
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/30 via-blue-500/40 to-blue-600/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                    <Button
                      type="submit"
                      className="relative w-full bg-gradient-to-r from-[#005782] via-[#0a5a85] to-[#0d537b] hover:from-[#004a6f] hover:via-[#085170] hover:to-[#0b4a6b] text-white font-semibold py-6 text-base rounded-xl shadow-[0_4px_20px_rgba(0,87,130,0.4)] hover:shadow-[0_6px_30px_rgba(0,87,130,0.5)] transition-all duration-300 transform hover:scale-[1.02] border border-white/20 backdrop-blur-sm overflow-hidden"
                      disabled={isLoading}
                    >
                      {/* Shimmer effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                      {/* Button text */}
                      <span className="relative z-10">
                        {isLoading ? "Signing in..." : "Sign In"}
                      </span>
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </BackgroundGradientAnimation>
    </div>
  );
}
