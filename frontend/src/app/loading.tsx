import Image from "next/image";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white dark:bg-[#0B0F19]">
      <div className="relative w-24 h-24 sm:w-32 sm:h-32 animate-pulse">
        <Image
          src="/logo.png"
          alt="Loading Kuba..."
          fill
          className="object-contain"
          priority
        />
      </div>
    </div>
  );
}
