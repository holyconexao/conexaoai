import { TrendingUp, ArrowRight, Zap, Globe, Cpu } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { PostCard } from "@/components/blog/PostCard";
import { SearchForm } from "@/components/layout/SearchForm";
import { NewsletterCTA } from "@/components/newsletter/NewsletterCTA";
import { api } from "@/lib/api";
import { editorialPillars, homepageSignals } from "@/lib/site";

export const revalidate = 60;

export default async function HomePage() {
  const [featured, latest, categories] = await Promise.all([
    api.posts.featured().catch(
      () => ({ count: 0, next: null, previous: null, results: [] }) as Awaited<ReturnType<typeof api.posts.featured>>,
    ),
    api.posts.list("page_size=9").catch(
      () => ({ count: 0, next: null, previous: null, results: [] }) as Awaited<ReturnType<typeof api.posts.list>>,
    ),
    api.categories.list().catch(() => []),
  ]);
  const featuredPost = featured.results[0] ?? latest.results[0] ?? null;
  const latestPosts = latest.results.filter((post) => post.id !== featuredPost?.id).slice(0, 6);

  return (
    <>
      <section className="relative overflow-hidden border-b border-border bg-background">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero_bg_abstract_ai_systems_1777165537122.png"
            alt="Conexão AI Background"
            fill
            className="object-cover opacity-10 blur-[100px]"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-b from-background via-transparent to-background" />
        </div>

        <div className={`relative z-10 mx-auto grid w-full max-w-7xl gap-12 px-6 py-16 lg:py-24 ${
          featuredPost ? "lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]" : "lg:grid-cols-1"
        }`}>
          <div className="space-y-10">
            <div className="space-y-6 text-center lg:text-left">
              <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 lg:mx-0">
                <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                  Intelligence for Global Operators
                </span>
              </div>
              <h1 className="font-display text-5xl leading-[0.95] text-foreground sm:text-7xl lg:text-8xl xl:text-9xl">
                AI, Business <br className="hidden lg:block" />& Systems
              </h1>
              <p className="mx-auto max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl sm:leading-9 lg:mx-0">
                Direct insights, structured analysis and dense guides for teams that need to move
                fast without lowering their standards. Built for the modern operational elite.
              </p>
            </div>
            
            <div className="mx-auto max-w-2xl lg:mx-0">
              <SearchForm
                buttonLabel="Read insights"
                placeholder="Search AI, tools, growth, automation and systems..."
                variant="hero"
              />
            </div>

            <div className="grid gap-8 sm:grid-cols-3">
              {homepageSignals.map((signal) => (
                <div key={signal.title} className="group space-y-4">
                  <div className="flex size-10 items-center justify-center rounded-xl border border-border bg-muted/50 transition group-hover:border-primary/50 group-hover:bg-primary/5">
                    <signal.icon className="size-5 text-muted-foreground transition group-hover:text-primary" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-foreground">{signal.title}</p>
                      <ArrowRight className="size-3 -translate-x-2 opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100" />
                    </div>
                    <p className="text-sm leading-6 text-muted-foreground">{signal.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {featuredPost ? (
            <div className="space-y-6 lg:border-l lg:border-border lg:pl-12">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="size-4 text-primary" />
                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary">
                    Featured story
                  </p>
                </div>
                <Link className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground transition hover:text-foreground" href="/blog">
                  Browse all
                </Link>
              </div>
              <FeaturedPost post={featuredPost} />
            </div>
          ) : null}
        </div>
      </section>

      {/* Top Categories Bar */}
      <section className="border-b border-border bg-muted/20">
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center gap-x-8 gap-y-4 px-6 py-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            Top Categories:
          </p>
          <div className="flex flex-wrap items-center gap-6">
            {categories.slice(0, 6).map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className="text-xs font-bold text-foreground/70 transition hover:text-primary"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-muted">
        <div className="mx-auto w-full max-w-7xl px-6 py-12">
          <div className="mb-6 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Editorial pillars
            </p>
            <h2 className="font-display text-4xl leading-none text-foreground sm:text-5xl">
              Built to be global, fast to scan and deep enough to trust.
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {categoryLinks.map((item) => (
              <Link
                key={item.href}
                className="rounded-lg border border-border bg-card p-5 transition hover:border-[rgba(37,99,235,0.24)] hover:shadow-[0_14px_30px_rgba(15,23,42,0.05)]"
                href={item.href}
              >
                <p className="text-sm font-semibold text-foreground">{item.label}</p>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">{item.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 py-16">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Zap className="size-4 text-primary" />
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                Latest Breakdown
              </p>
            </div>
            <h2 className="font-display text-4xl leading-tight text-foreground sm:text-6xl">
              Recent articles worth the scroll
            </h2>
            <p className="max-w-2xl text-base text-muted-foreground">
              Practical guides and deep-dives released this week for operators moving at the speed of AI.
            </p>
          </div>
          <Link 
            className="group inline-flex items-center gap-2 text-sm font-bold text-foreground transition hover:text-primary" 
            href="/blog"
          >
            View all articles
            <ArrowRight className="size-4 transition group-hover:translate-x-1" />
          </Link>
        </div>
        {latestPosts.length ? (
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
            {latestPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="mt-12 rounded-2xl border border-border bg-muted/30 p-12 text-center">
            <p className="text-muted-foreground italic">
              No published articles yet. The layout is already optimized for a dense editorial feed.
            </p>
          </div>
        )}
      </section>

      <NewsletterCTA />
    </>
  );
}
