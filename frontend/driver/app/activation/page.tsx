// app/activation/page.tsx
import { Suspense } from "react";
import ActivationPageContent from "@/app/activation/ActivationPageContent";

export default function ActivationPage() {
  return (
    <Suspense fallback={<div className="text-center mt-10">Loading activation page...</div>}>
      <ActivationPageContent />
    </Suspense>
  );
}
