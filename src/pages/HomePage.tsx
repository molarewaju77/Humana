import { Link } from "react-router-dom";
import {
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Users,
  Briefcase,
  Heart,
  Lightbulb,
  Globe,
  ChevronRight,
  Star,
  CheckCircle2,
  Sparkles,
  Clock,
  Award,
  Landmark,
  HeartPulse,
  GraduationCap,
} from "lucide-react";
import Button from "../components/ui/Button";
import heroHealthcare from "../assets/hero_healthcare.jpg";

const trustFeatures = [
  {
    icon: Landmark,
    title: "Industry-Leading 401(k) Match",
    description:
      "Dollar-for-dollar company 401(k) match up to 6% with immediate vesting and professional retirement planning guidance.",
  },
  {
    icon: HeartPulse,
    title: "Comprehensive Health & Well-being",
    description:
      "Day-one medical, dental, and vision coverage, prescription plans, and personalized employee wellness incentives.",
  },
  {
    icon: GraduationCap,
    title: "Tuition Assistance & Growth",
    description:
      "Up to 100% tuition reimbursement, specialized healthcare certifications, and structured career progression pathways.",
  },
  {
    icon: Clock,
    title: "Generous PTO & Work-Life Balance",
    description:
      "Flexible paid time off, paid parental and caregiver leave, dedicated volunteer hours, and hybrid work arrangements.",
  },
];

const jobCategories = [
  {
    category: "Technology",
    description:
      "Software engineering, data infrastructure, cloud, and digital product development.",
    icon: "💻",
    count: "24 open roles",
  },
  {
    category: "Healthcare",
    description:
      "Clinical, patient care, health administration, and allied health professionals.",
    icon: "🏥",
    count: "38 open roles",
  },
  {
    category: "Customer Experience",
    description:
      "Member services, support coordination, and care navigation specialists.",
    icon: "🤝",
    count: "19 open roles",
  },
  {
    category: "Operations",
    description:
      "Process management, quality, logistics, and operational excellence roles.",
    icon: "⚙️",
    count: "12 open roles",
  },
  {
    category: "Finance",
    description:
      "Accounting, financial analysis, treasury, and strategic planning professionals.",
    icon: "📊",
    count: "8 open roles",
  },
  {
    category: "Data & Analytics",
    description:
      "Data science, business intelligence, machine learning, and insights roles.",
    icon: "📈",
    count: "15 open roles",
  },
  {
    category: "Corporate Services",
    description:
      "HR, legal, communications, facilities, and enterprise support functions.",
    icon: "🏢",
    count: "10 open roles",
  },
];

const benefits = [
  {
    icon: Landmark,
    title: "We Offer the Best 401(k) Match",
    description:
      "Dollar-for-dollar company match up to 6%, with immediate vesting and complimentary retirement planning guidance.",
  },
  {
    icon: HeartPulse,
    title: "Day-One Health & Wellness",
    description:
      "Comprehensive medical, dental, vision, and mental health coverage starting on your very first day with wellness stipends.",
  },
  {
    icon: GraduationCap,
    title: "Tuition Assistance & Growth",
    description:
      "Up to 100% tuition reimbursement, certified skill training, and clear structured pathways for leadership development.",
  },
  {
    icon: Clock,
    title: "Generous PTO & Flexibility",
    description:
      "Flexible paid time off, paid caregiver leave, volunteer days, and supportive hybrid work environments.",
  },
];

const howItWorks = [
  {
    step: "01",
    title: "Explore opportunities",
    desc: "Browse open roles across healthcare, technology, operations, and more.",
  },
  {
    step: "02",
    title: "Complete your application",
    desc: "Work through clearly grouped sections at your own pace, with guidance at every step.",
  },
  {
    step: "03",
    title: "Submit securely",
    desc: "Upload your resume and supporting documents through our secure submission system.",
  },
  {
    step: "04",
    title: "Receive confirmation",
    desc: "Get an instant reference number and next-step updates from our recruitment team.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* ====== HERO ====== */}
      <section className="relative overflow-hidden border-b border-brand-border/60 bg-[#FAFCF8]">
        {/* Dynamic ambient gradients & grid pattern */}
        <div
          className="pointer-events-none absolute inset-0 hero-mesh-gradient"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-0 hero-subtle-grid"
          aria-hidden="true"
        />

        {/* Ambient blurred glow orbs */}
        <div
          className="pointer-events-none absolute -right-24 -top-24 size-[32rem] rounded-full bg-primary/10 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -left-20 top-1/2 size-[26rem] rounded-full bg-primary-light/10 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute left-1/3 top-8 size-[30rem] rounded-full bg-emerald-100/40 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-7xl px-5 sm:px-8 pt-14 sm:pt-9 lg:pt-10 pb-12 lg:pb-16">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-14 lg:items-center">
            {/* Left column */}
            <div className="max-w-2xl animate-fade-in">
              {/* Badge (clean, no >) */}
              <div className="inline-flex items-center gap-2.5 rounded-full border border-primary/25 bg-white/90 backdrop-blur-md px-3.5 py-1.5 text-xs font-semibold text-brand-deeptext shadow-xs hover:border-primary/40 transition-colors">
                <span className="relative flex size-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex rounded-full size-2 bg-primary" />
                </span>
                <span>Now Hiring for 2026 Clinical & Corporate Openings</span>
              </div>

              {/* Title with generous spacing */}
              <h1 className="mt-6 sm:mt-8 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-[3.75rem] leading-[1.14] sm:leading-[1.1] text-brand-deeptext text-balance">
                Where Compassion Meets{" "}
                <span className="bg-gradient-to-r from-primary via-[#5fa82e] to-[#2d5c14] bg-clip-text text-transparent block sm:inline">
                  World-Class Careers
                </span>
              </h1>

              {/* Description with generous spacing and relaxed line height */}
              <p className="mt-6 sm:mt-7 text-base sm:text-lg text-brand-secondarytext leading-relaxed max-w-xl font-normal">
                Connect your passion for healthcare, clinical excellence, and
                innovation with an organisation trusted by millions. One
                streamlined application unlocks direct consideration across all
                departments.
              </p>

              {/* CTA row with high visibility */}
              <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row sm:items-center gap-3.5">
                <Link to="/benefits" className="group w-full sm:w-auto">
                  <Button
                    size="lg"
                    variant="primary"
                    rightIcon={
                      <ArrowRight
                        size={18}
                        className="transition-transform duration-200 group-hover:translate-x-1 text-white"
                      />
                    }
                    className="w-full sm:w-auto shadow-md hover:shadow-lg transition-all text-base px-8 py-3.5 rounded-xl font-medium"
                  >
                    Explore Employee Benefits
                  </Button>
                </Link>
                <Link to="/apply" className="group w-full sm:w-auto">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto text-base px-7 py-3.5 rounded-xl font-medium bg-white text-primary border-2 border-primary hover:bg-primary hover:text-white transition-all shadow-xs"
                  >
                    Apply Now
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right column — Visual Healthcare Showcase */}
            <div className="relative animate-slide-in-right mt-4 lg:mt-0">
              {/* Decorative background glow */}
              <div className="absolute -inset-2 bg-gradient-to-tr from-primary/15 via-emerald-100/30 to-transparent rounded-[2.5rem] blur-xl opacity-70 -z-10" />

              {/* Main Visual Frame */}
              <div className="relative rounded-[2rem] border-4 border-white bg-white shadow-2xl overflow-hidden group">
                <img
                  src={heroHealthcare}
                  alt="Humana healthcare professionals collaborating in a modern medical innovation center"
                  className="w-full h-[410px] sm:h-[450px] lg:h-[475px] object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="eager"
                />

                {/* Subtle gradient overlay at bottom for readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 pointer-events-none" />

                {/* Bottom Snapshot Card inside Frame */}
                <div className="absolute bottom-3 inset-x-3 sm:bottom-4 sm:inset-x-4 glass-card rounded-xl sm:rounded-2xl p-3 sm:p-3.5 border border-white/80 shadow-lg flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="size-9 sm:size-10 rounded-xl bg-primary flex items-center justify-center text-white shrink-0 shadow-xs">
                      <Briefcase size={18} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-brand-deeptext truncate">
                        Streamlined 6-Step Application
                      </p>
                      <p className="text-[11px] text-brand-secondarytext mt-0.5">
                        Average completion: 10–12 mins
                      </p>
                    </div>
                  </div>
                  <Link to="/apply" className="shrink-0">
                    <Button
                      size="sm"
                      variant="primary"
                      className="text-xs font-medium px-3.5 py-1.5 shadow-xs"
                    >
                      Apply
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Floating Glassmorphic Pill 1 — Top Left */}
              <div className="absolute top-4 -left-3 sm:-left-6 glass-card rounded-2xl p-3 shadow-xl border border-white/90 animate-float-slow z-20 max-w-[210px] hidden sm:flex items-center gap-3">
                <div className="size-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Sparkles size={16} />
                </div>
                <div>
                  <p className="text-xs font-bold text-brand-deeptext leading-tight">
                    Priority Review
                  </p>
                  <p className="text-[11px] text-brand-secondarytext mt-0.5">
                    Average turnaround 48h
                  </p>
                </div>
              </div>

              {/* Floating Glassmorphic Pill 2 — Bottom Right */}
              <div className="absolute -bottom-3 -right-3 sm:-right-5 glass-card rounded-2xl p-3 shadow-xl border border-white/90 animate-float-reverse z-20 max-w-[240px] hidden sm:flex items-start gap-2.5">
                <div className="size-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-primary shrink-0">
                  <Award size={16} />
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={11}
                        className="fill-amber-400 text-amber-400"
                      />
                    ))}
                    <span className="text-xs font-bold text-brand-deeptext ml-1">
                      4.9/5
                    </span>
                  </div>
                  <p className="text-[11px] text-brand-secondarytext mt-0.5 leading-snug font-medium">
                    Top 10 Healthcare Employer
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====== STATS & CREDIBILITY RIBBON (BELOW HERO) ====== */}
      <section className="relative z-10 border-b border-brand-border/70 bg-white/95 backdrop-blur-md py-8 sm:py-10">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6 lg:gap-8">
            <div className="p-4 sm:p-5 rounded-2xl bg-[#FAFCF8] border border-brand-border/70 hover:border-primary/30 transition-all duration-200 shadow-xs">
              <span className="block font-extrabold text-2xl sm:text-3xl lg:text-4xl text-brand-deeptext tracking-tight">
                2,400+
              </span>
              <span className="mt-1 block text-xs sm:text-sm font-bold text-brand-deeptext">
                Careers Placed
              </span>
              <span className="mt-0.5 block text-[11px] sm:text-xs text-brand-secondarytext">
                Clinical & corporate roles
              </span>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-[#FAFCF8] border border-brand-border/70 hover:border-primary/30 transition-all duration-200 shadow-xs">
              <span className="block font-extrabold text-2xl sm:text-3xl lg:text-4xl text-brand-deeptext tracking-tight">
                98%
              </span>
              <span className="mt-1 block text-xs sm:text-sm font-bold text-brand-deeptext">
                Approval Rating
              </span>
              <span className="mt-0.5 block text-[11px] sm:text-xs text-brand-secondarytext">
                Candidate satisfaction score
              </span>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-[#FAFCF8] border border-brand-border/70 hover:border-primary/30 transition-all duration-200 shadow-xs">
              <span className="block font-extrabold text-2xl sm:text-3xl lg:text-4xl text-primary tracking-tight">
                50+
              </span>
              <span className="mt-1 block text-xs sm:text-sm font-bold text-brand-deeptext">
                Career Tracks
              </span>
              <span className="mt-0.5 block text-[11px] sm:text-xs text-brand-secondarytext">
                Active pathways open
              </span>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-[#FAFCF8] border border-brand-border/70 hover:border-primary/30 transition-all duration-200 shadow-xs flex flex-col justify-center">
              <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm text-brand-deeptext">
                <CheckCircle2 size={16} className="text-primary shrink-0" />
                <span className="truncate">Direct Consideration</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium text-[11px] sm:text-xs text-brand-secondarytext mt-1.5">
                <Clock size={14} className="text-primary shrink-0" />
                <span>5-Day Review Turnaround</span>
              </div>
              <span className="mt-1 text-[11px] text-brand-secondarytext">
                100% Free & confidential
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ====== TRUST SECTION ====== */}
      <section
        id="about"
        className="py-20 sm:py-28 border-b border-brand-border"
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="max-w-2xl">
            <p className="section-label">Why choose Humana</p>
            <h2 className="mt-4 text-3xl font-bold text-brand-deeptext sm:text-4xl">
              Comprehensive benefits designed for your future
            </h2>
            <p className="mt-4 text-base leading-relaxed text-brand-secondarytext">
              We invest in our people with industry-leading retirement plans, comprehensive healthcare coverage from day one, and continuous career development.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {trustFeatures.map(({ icon: Icon, title, description }) => (
              <article
                key={title}
                className="group rounded-2xl border border-brand-border bg-white p-6 shadow-card hover:shadow-card-md hover:border-primary/40 hover:-translate-y-1 transition-all duration-200"
              >
                <div className="flex items-center justify-center size-11 rounded-xl bg-primary text-white mb-5 shadow-xs group-hover:scale-110 transition-all duration-300">
                  <Icon size={20} />
                </div>
                <h3 className="text-base font-semibold text-brand-deeptext group-hover:text-primary transition-colors">
                  {title}
                </h3>
                <p className="mt-2.5 text-sm text-brand-secondarytext leading-relaxed">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ====== HOW IT WORKS ====== */}
      <section className="bg-brand-softbg border-b border-brand-border">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 py-20 sm:py-28">
          <div className="max-w-2xl">
            <p className="section-label">How it works</p>
            <h2 className="mt-4 text-3xl font-bold text-brand-deeptext sm:text-4xl">
              Four steps from interest to confirmation
            </h2>
          </div>

          <ol className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-brand-border bg-brand-border md:grid-cols-2 lg:grid-cols-4">
            {howItWorks.map(({ step, title, desc }) => (
              <li key={step} className="bg-white p-8">
                <span className="font-bold text-sm text-primary">{step}</span>
                <h3 className="mt-4 text-base font-semibold text-brand-deeptext">
                  {title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-brand-secondarytext">
                  {desc}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ====== OPPORTUNITIES ====== */}
      <section
        id="opportunities"
        className="py-20 sm:py-28 border-b border-brand-border"
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div className="max-w-2xl">
              <p className="section-label">Find your next role</p>
              <h2 className="mt-4 text-3xl font-bold text-brand-deeptext sm:text-4xl">
                Find Your Next Opportunity
              </h2>
              <p className="mt-4 text-base text-brand-secondarytext leading-relaxed">
                Explore open positions across departments. A single application
                connects you to the roles that match your experience and
                aspirations.
              </p>
            </div>
            <Link to="/apply" className="shrink-0">
              <Button
                variant="outline"
                size="md"
                rightIcon={<ArrowRight size={16} />}
              >
                Apply to any role
              </Button>
            </Link>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {jobCategories.map(({ category, description, icon, count }) => (
              <Link
                key={category}
                to="/apply"
                className="group flex flex-col rounded-xl border border-brand-border bg-white p-6 shadow-card hover:shadow-card-md hover:border-primary/30 hover:-translate-y-0.5 transition-all duration-200"
              >
                <span className="text-2xl" aria-hidden="true">
                  {icon}
                </span>
                <div className="mt-4 flex-1">
                  <h3 className="text-base font-semibold text-brand-deeptext group-hover:text-primary transition-colors">
                    {category}
                  </h3>
                  <p className="mt-1.5 text-sm text-brand-secondarytext leading-relaxed">
                    {description}
                  </p>
                </div>
                <div className="mt-5 flex items-center justify-between">
                  <span className="text-xs font-medium text-brand-secondarytext">
                    {count}
                  </span>
                  <span className="text-xs font-semibold text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                    Explore roles <ChevronRight size={13} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ====== WHY JOIN US ====== */}
      <section className="bg-brand-softbg border-b border-brand-border">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 py-20 sm:py-28">
          <div className="text-center max-w-2xl mx-auto">
            <p className="section-label">More than a job</p>
            <h2 className="mt-4 text-3xl font-bold text-brand-deeptext sm:text-4xl">
              More Than a Job
            </h2>
            <p className="mt-4 text-base text-brand-secondarytext leading-relaxed">
              We invest in our people. Because when our team thrives, the people
              we serve do too.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="group bg-white rounded-2xl border border-brand-border p-7 shadow-card hover:shadow-card-md hover:border-primary/40 hover:-translate-y-1 transition-all duration-200"
              >
                <div className="size-12 rounded-2xl bg-primary flex items-center justify-center text-white mb-5 shadow-xs group-hover:scale-110 group-hover:shadow-md transition-all duration-300">
                  <Icon size={22} />
                </div>
                <h3 className="font-semibold text-base text-brand-deeptext group-hover:text-primary transition-colors">
                  {title}
                </h3>
                <p className="mt-2.5 text-sm text-brand-secondarytext leading-relaxed">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== COMMITMENT SECTION ====== */}
      <section className="py-20 sm:py-28 border-b border-brand-border">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="max-w-2xl">
            <p className="section-label">Our commitment</p>
            <h2 className="mt-4 text-3xl font-bold text-brand-deeptext sm:text-4xl">
              Trusted standards across every placement
            </h2>
            <p className="mt-4 text-base leading-relaxed text-brand-secondarytext">
              Every application is reviewed with fairness, care, and respect for
              your privacy.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: ShieldCheck,
                title: "Equal opportunity",
                desc: "Every candidate is evaluated on their merits.",
              },
              {
                icon: CheckCircle2,
                title: "Verified process",
                desc: "A structured, transparent hiring workflow.",
              },
              {
                icon: Star,
                title: "Data protection",
                desc: "Your information is kept private and secure.",
              },
              {
                icon: Users,
                title: "Human review",
                desc: "A real person reviews every application.",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="flex gap-4 p-6 rounded-xl border border-brand-border bg-white shadow-card"
              >
                <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Icon size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-brand-deeptext">
                    {title}
                  </h3>
                  <p className="mt-1 text-xs text-brand-secondarytext leading-relaxed">
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== CAREER CTA ====== */}
      <section className="bg-primary relative overflow-hidden">
        <div className="mx-auto max-w-5xl px-5 sm:px-8 py-20 sm:py-24 flex flex-col items-center text-center">
          <p className="text-primary-100 text-xs sm:text-sm font-semibold uppercase tracking-widest text-center">
            Take the next step
          </p>
          <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl lg:text-5xl text-center text-balance">
            Ready for your next opportunity?
          </h2>
          <p className="mt-5 text-base sm:text-lg text-white/85 max-w-xl mx-auto text-center leading-relaxed">
            Take the next step toward a career where your work can make a
            meaningful difference in people's lives every day.
          </p>
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3.5 justify-center items-center">
            <Link to="/apply" className="w-full sm:w-auto group">
              <Button
                size="lg"
                variant="outline-white"
                className="w-full sm:w-auto font-medium text-base px-8 py-3.5 rounded-xl border border-white hover:bg-white/10 active:bg-white/20 text-white transition-all duration-200"
                rightIcon={
                  <ArrowRight
                    size={18}
                    className="text-white transition-transform duration-200 group-hover:translate-x-1"
                  />
                }
              >
                Apply Now
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
