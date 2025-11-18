"use client";
import { useLoader } from "@/app/context/LoaderContext";
import PulseRingsLoader from "./loader";

export default function GlobalLoader() {
  const { isLoading } = useLoader();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-[9999] flex items-center justify-center">
      <PulseRingsLoader />
    </div>
  );
}
