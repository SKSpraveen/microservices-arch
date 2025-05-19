// pages/activation.js (or any relevant file)
"use client";
import { Suspense, useState } from "react";
import dynamic from "next/dynamic";
import Navbar from "@/components/navbar";
import Footer from "@/components/home/footer";
import { activateAccount, resendOTP } from "@/api";

// Dynamically import the component that uses `useSearchParams`
const ActivationContent = dynamic(() => import('./ActivationContent'), {
  ssr: false, // Disable SSR for this component, ensure it runs only on the client
});

export default function ActivationPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="flex min-h-screen flex-col bg-gradient-to-b from-background to-muted/50 dark:from-dark-900 dark:via-dark-900 dark:to-dark-800">
        <Navbar />
        <ActivationContent />
        <Footer />
      </div>
    </Suspense>
  );
}
