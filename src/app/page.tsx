import { Button } from "@/components/ui/button";
import {
  ClerkLoaded,
  ClerkLoading,
  SignIn,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";
import {
  ChevronRight,
  Eraser,
  ImageUpscale,
  Loader2,
  SunMoon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const tools = [
  {
    name: "Remove Background",
    icon: <Eraser className="w-5 h-5" />,
    process: "remove-bg",
    settings: null,
  },
  {
    name: "Upscale",
    icon: <ImageUpscale className="w-5 h-5" />,
    process: "upscale",
    settings: { factor: 2 },
  },
  {
    name: "Fix Lighting",
    icon: <SunMoon className="w-5 h-5" />,
    process: "light-fix",
    settings: { alpha: 0.5 },
  },
];

const presets = [
  {
    name: "Amazon",
    logo: "/logos/amazon.svg",
    process: "amazon",
    dimension: { width: 2000, height: 2000 },
    format: "JPEG",
  },
  {
    name: "Ebay",
    logo: "/logos/ebay.svg",
    process: "ebay",
    dimension: { width: 1600, height: 1600 },
    format: "JPEG",
  },
  {
    name: "Flipkart",
    logo: "/logos/flipkart.svg",
    process: "flipkart",
    dimension: { width: 2000, height: 2000 },
    format: "JPEG",
  },
  {
    name: "Instagram",
    logo: "/logos/instagram.svg",
    process: "instagram",
    dimension: { width: 1080, height: 1080 },
    format: "JPEG",
  },
  {
    name: "Etsy",
    logo: "/logos/etsy.svg",
    process: "etsy",
    dimension: { width: 2000, height: 2000 },
    format: "JPEG",
  },
];

export default function Home() {
  return (
    <div>
      <div className="fixed top-0 z-[-2] h-screen w-screen bg-white bg-[radial-gradient(100%_50%_at_50%_0%,rgba(0,163,255,0.13)_0,rgba(0,163,255,0)_50%,rgba(0,163,255,0)_100%)]"></div>
      <header className="p-3 lg:p-4 fixed top-0 left-0 right-0 z-50 backdrop-blur-xs">
        <div className="flex items-center justify-between gap-4">
          <Image
            src={"/images/logo-text.png"}
            alt="logo"
            width={200}
            height={100}
            className="w-28 lg:w-28"
          />

          <div>
            <ClerkLoading>
              <Loader2 className="animate-spin" />
            </ClerkLoading>
            <ClerkLoaded>
              <SignInButton
                signUpForceRedirectUrl={
                  "/auth/success?success_redirect=/&failure_redirect=/"
                }
              >
                <Button variant={"secondary"}>Sign In</Button>
              </SignInButton>
            </ClerkLoaded>
          </div>
        </div>
      </header>
      <main className="min-h-screen p-5 pt-[60px]">
        {/* HERO SECTION */}
        <section>
          <div className="text-center space-y-5 mx-auto mt-20 ">
            <h1 className="text-4xl lg:text-6xl font-bold font-inter">
              Make Professional Product Photos <br /> &mdash; Instantly
            </h1>
            <p className="text-black/90 text-lg lg:text-2xl">
              From raw to retail-ready in one click — powered by AI, built for
              e-commerce.
            </p>

            <ClerkLoading>
              <Button className="mt-4 text-base h-12 !px-6">
                <Loader2 className="animate-spin" />
              </Button>
            </ClerkLoading>

            <ClerkLoaded>
              <SignInButton
                signUpForceRedirectUrl={
                  "/auth/success?success_redirect=/&failure_redirect=/"
                }
              >
                <Button className="mt-4 text-base h-12 !px-6">
                  Get Started <ChevronRight />
                </Button>
              </SignInButton>
            </ClerkLoaded>
          </div>

          <div className="mt-20 h-20 bg-muted flex items-center justify-center">
            Editor In Action
          </div>
        </section>

        {/* Feature Section */}
        <section className="mt-40">
          <div className="flex flex-col items-center text-center space-y-2">
            <h2 className="text-3xl lg:text-5xl font-bold font-inter">
              Features
            </h2>
          </div>

          <div className="mt-15">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">🎯 Background Removal</h2>
              <p className="text-black/80 ">
                Clean, distraction-free images that highlight your products.
              </p>
            </div>

            <div className="mt-10 h-15 bg-muted flex items-center justify-center">
              Live Editor GIF
            </div>
          </div>
          <div className="mt-15">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">⚡4x Upscaling</h2>
              <p className="text-black/80 ">
                Make every pixel sharp and ready for any platform.
              </p>
            </div>

            <div className="mt-10 h-15 bg-muted flex items-center justify-center">
              Live Editor GIF
            </div>
          </div>
          <div className="mt-15">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">💡Lighting & Color Fix</h2>
              <p className="text-black/80 ">
                Automatically adjust brightness, contrast, and shadows.
              </p>
            </div>

            <div className="mt-10 h-15 bg-muted flex items-center justify-center">
              Live Editor GIF
            </div>
          </div>
          <div className="mt-15">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">🪄 Batch Processing</h2>
              <p className="text-black/80 ">
                Edit 100 images in one go — save hours every week.
              </p>
            </div>

            <div className="mt-10 h-15 bg-muted flex items-center justify-center">
              Live Editor GIF
            </div>
          </div>
        </section>
        {/* Live Interaction */}
        <section className="mt-40">
          <div>
            <h2 className="text-3xl font-bold text-center">Try it Live</h2>
          </div>

          <div className="mt-15">
            <div className="h-30 bg-muted flex items-center justify-center">
              Main Photo
            </div>
            <div className="flex items-center justify-center gap-2 mt-5">
              <div className="w-20 h-20 bg-muted flex items-center justify-center">
                Image1
              </div>
              <div className="w-20 h-20 bg-muted flex items-center justify-center">
                Image1
              </div>
              <div className="w-20 h-20 bg-muted flex items-center justify-center">
                Image1
              </div>
            </div>

            <div className="flex gap-2 flex-wrap justify-center mt-10">
              {tools.map((tool, idx) => (
                <button
                  key={tool.process}
                  // style={{ background: getUniqueSmoothColor(idx) }}
                  className="w-fit rounded-full flex items-center p-2 px-3 text-black/90 gap-2 border transition-all cursor-pointer hover:border-gray-300 hover:border-1 hover:scale-105 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-sm text-sm"
                >
                  <div>{tool.icon}</div>
                  <span>{tool.name}</span>
                </button>
              ))}

              {presets.map((preset, idx) => (
                <button
                  key={preset.process}
                  // style={{ background: getUniqueSmoothColor(idx + 5) }}
                  className="w-fit rounded-full flex items-center p-2 px-3 text-black/90 gap-2 border transition-all cursor-pointer hover:border-gray-300 hover:border-1 hover:scale-105 disabled:cursor-not-allowed disabled:scale-100 shadow-sm text-sm"
                >
                  <Image
                    src={preset.logo}
                    alt={preset.name}
                    width={20}
                    height={20}
                  />
                  <span>{preset.name}</span>
                </button>
              ))}
            </div>
          </div>
        </section>
        {/* Brands */}
        <section className="mt-40">
          <div>
            <h2 className="text-3xl font-bold text-center">
              3000+ Brands Trust Us
            </h2>
          </div>

          <div className="mt-10 text-center">Brands Logo Carousel</div>
        </section>
      </main>

      <footer className="mt-40 bg-black text-white p-5">
        <div>Designed & Developed by Rahul Singhania</div>
      </footer>
    </div>
  );
}
