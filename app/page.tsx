import { Chrome } from "@/components/chrome";

export default function Home() {
  return (
    <main className="relative h-dvh w-full overflow-hidden">
      {/* Native img on purpose: next/image recompresses a 1024px scene and makes it softer. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/bg.png"
        alt="Qawwali darbar"
        className="absolute inset-0 h-full w-full object-cover object-[center_20%]"
      />
      <Chrome />
    </main>
  );
}
