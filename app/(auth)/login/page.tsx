"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect } from "react";
import LoginForm from "../_components/LoginForm";
import { ArrowLeft, Shield, Award, CheckCircle } from "lucide-react";

export default function LoginPage() {
  useEffect(() => {
    const href = "https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap";
    if (!document.querySelector(`link[href=\"${href}\"]`)) {
      const l = document.createElement('link');
      l.rel = 'stylesheet';
      l.href = href;
      document.head.appendChild(l);
      return () => { document.head.removeChild(l); };
    }
  }, []);

  return (
    <main style={{ fontFamily: 'Poppins, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial' }} className="min-h-screen bg-background flex">
      {/* Left Side - Branding */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-blue-600 to-primary relative overflow-hidden"
      >
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-black/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-white/5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center items-center w-full p-12 text-white">
          <div className="max-w-md text-center space-y-8">
            <div className="flex justify-center mb-8">
              <div className="relative w-24 h-24 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl flex items-center justify-center transform hover:scale-105 transition-transform duration-500">
                <Image
                  src="/images/pawcare.png"
                  alt="PawCare Logo"
                  width={80}
                  height={80}
                  className="object-contain drop-shadow-lg"
                />
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-4">Welcome Back</h2>
              <p className="text-white/80 leading-relaxed">
                Access your pet's health records, manage appointments, and continue providing the best care for your furry family member.
              </p>
            </div>

            {/* Trust Indicators */}
            <div className="space-y-4 pt-8">
              <div className="flex items-center gap-3 justify-center">
                <Shield className="w-5 h-5 text-green-400" />
                <span className="text-sm font-medium">Secure & HIPAA Compliant</span>
              </div>
              <div className="flex items-center gap-3 justify-center">
                <Award className="w-5 h-5 text-blue-400" />
                <span className="text-sm font-medium">Vet-Approved Platform</span>
              </div>
              <div className="flex items-center gap-3 justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
                <span className="text-sm font-medium">24/7 Emergency Support</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 bg-white lg:bg-background">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full max-w-md space-y-8"
        >
          {/* Back to Home */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          {/* Header */}
          {/* Header removed - handled by LoginForm */}

          {/* Login Form */}
          <LoginForm />

          {/* Additional Links removed - handled by LoginForm */}

          {/* Footer Text */}
          <div className="text-center pt-8 border-t border-border">
            <p className="text-xs text-muted-foreground">
              By signing in, you agree to our{" "}
              <Link href="/terms" className="text-primary hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </main>
  );
}

