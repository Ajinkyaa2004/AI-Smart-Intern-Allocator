import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Server, Database, Code2, Layers } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 sm:p-24 bg-background text-foreground">
      {/* Hero Section */}
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex mb-12">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-200 bg-white/50 pb-6 pt-8 backdrop-blur-2xl lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-white/60 lg:p-4">
          Powered by&nbsp;
          <code className="font-mono font-bold text-primary">Node + Express + MongoDB</code>
        </p>
      </div>

      <div className="relative flex place-items-center mb-16">
        <div className="relative z-10 text-center">
          <h1 className="text-6xl sm:text-7xl font-bold tracking-tight mb-4">
            InternMatch <span className="text-primary">AI</span>
          </h1>
          <p className="text-xl text-muted max-w-2xl mx-auto">
            Smart Allocation Engine for the Next Generation of Internships.
            Simple, Subtle, Professional.
          </p>
          <div className="mt-8 flex gap-4 justify-center">
            <Link href="/register" className="px-8 py-3 rounded-full bg-primary text-white font-semibold hover:opacity-90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
              Get Started
            </Link>
            <Link href="/login" className="px-8 py-3 rounded-full bg-white border border-gray-200 text-foreground font-semibold hover:bg-gray-50 transition-all shadow-sm">
              Sign In
            </Link>
          </div>
        </div>

        {/* Decorative background blob */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/20 blur-[100px] rounded-full -z-10 pointer-events-none" />
      </div>

      {/* Feature Grid */}
      <div className="mb-32 grid text-center lg:mb-0 lg:grid-cols-4 lg:text-left gap-6 w-full max-w-6xl">
        {[
          { title: "Next.js", desc: "App Router & Latest Features", icon: <Layers className="w-8 h-8 mb-4 text-primary" /> },
          { title: "Tailwind", desc: "Utility-first CSS Framework", icon: <Code2 className="w-8 h-8 mb-4 text-primary" /> },
          { title: "Express", desc: "Custom Node.js Server", icon: <Server className="w-8 h-8 mb-4 text-primary" /> },
          { title: "MongoDB", desc: "Mongoose ODM Integration", icon: <Database className="w-8 h-8 mb-4 text-primary" /> }
        ].map((item, i) => (
          <div key={i} className="group rounded-2xl border border-gray-100 bg-white px-6 py-8 transition-all hover:border-primary/20 hover:shadow-lg hover:-translate-y-1">
            {item.icon}
            <h2 className={`mb-3 text-2xl font-semibold`}>
              {item.title}{" "}
            </h2>
            <p className={`m-0 text-sm text-muted`}>
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
