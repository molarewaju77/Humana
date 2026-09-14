import { Link } from "react-router-dom";
import {
  Heart,
  Users,
  ShieldCheck,
  Award,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import Button from "../components/ui/Button";

const companyStats = [
  { metric: "60+ Years", label: "Healthcare Leadership" },
  { metric: "17M+", label: "Members Served Nationwide" },
  { metric: "98%", label: "Candidate Approval Rating" },
  { metric: "Top 10", label: "Healthcare Employer" },
];

const values = [
  {
    icon: Heart,
    title: "Compassion First",
    desc: "We put people at the center of every decision, caring for our patients, communities, and fellow team members with genuine empathy.",
  },
  {
    icon: ShieldCheck,
    title: "Integrity & Trust",
    desc: "We uphold the highest ethical standards, data protection, and transparency in everything we do.",
  },
  {
    icon: Users,
    title: "Inclusion & Belonging",
    desc: "We cultivate a workplace where diverse perspectives are celebrated, valued, and empowered to excel.",
  },
  {
    icon: Award,
    title: "Excellence & Growth",
    desc: "We relentlessly pursue continuous improvement, supporting our workforce with education and leadership opportunities.",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-white text-brand-deeptext min-h-screen">
      {/* ====== CLEAN MINIMAL HERO ====== */}
      <section className="border-b border-brand-border/60 bg-[#FAFCF8] py-12 sm:py-16">
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-block text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full mb-4">
              About Humana
            </span>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-brand-deeptext tracking-tight leading-tight">
              Human Care for a Better Tomorrow
            </h1>

            <p className="mt-4 text-base sm:text-lg text-brand-secondarytext leading-relaxed font-normal max-w-2xl mx-auto">
              Humana is a leading healthcare company dedicated to helping
              millions of people achieve their best health. We connect
              passionate professionals with transformative careers.
            </p>
          </div>

          {/* Stats Bar */}
          <div className="mt-10 pt-8 border-t border-brand-border/60 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {companyStats.map((stat) => (
              <div key={stat.label} className="p-3">
                <span className="block text-2xl sm:text-3xl font-extrabold text-brand-deeptext">
                  {stat.metric}
                </span>
                <span className="block text-xs text-brand-secondarytext font-medium mt-1">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== MISSION & VISION ====== */}
      <section className="py-12 sm:py-16 border-b border-brand-border bg-white">
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Our Purpose
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-brand-deeptext">
                Empowering People to Live Healthier Lives
              </h2>
              <p className="text-sm text-brand-secondarytext leading-relaxed">
                For over six decades, Humana has stood at the forefront of
                healthcare innovation. Headquartered in Louisville, Kentucky, we
                combine clinical expertise, technology, and human compassion to
                deliver care when and where it matters most.
              </p>
              <p className="text-sm text-brand-secondarytext leading-relaxed">
                Our workforce includes tens of thousands of dedicated nurses,
                physicians, data scientists, software engineers, and
                administrative professionals working together across all 50
                states.
              </p>
            </div>

            <div className="rounded-2xl border border-brand-border bg-[#FAFCF8] p-6 sm:p-8 space-y-4">
              <h3 className="text-lg font-bold text-brand-deeptext border-b border-brand-border pb-3">
                Corporate Highlights
              </h3>
              <ul className="space-y-3 text-xs sm:text-sm text-brand-secondarytext">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2
                    size={16}
                    className="text-primary shrink-0 mt-0.5"
                  />
                  <span>
                    Ranked among the Fortune 50 largest corporations in America.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2
                    size={16}
                    className="text-primary shrink-0 mt-0.5"
                  />
                  <span>
                    Consistently recognized as a Top Employer for Diversity and
                    Inclusion.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2
                    size={16}
                    className="text-primary shrink-0 mt-0.5"
                  />
                  <span>
                    Industry-leading employee benefits, 401(k) matching, and
                    tuition assistance.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2
                    size={16}
                    className="text-primary shrink-0 mt-0.5"
                  />
                  <span>
                    Comprehensive remote and hybrid career
                    opportunities.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ====== CORE VALUES ====== */}
      <section className="py-12 sm:py-16 border-b border-brand-border bg-[#FAFCF8]">
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-brand-deeptext">
              Our Values
            </h2>
            <p className="mt-2 text-sm text-brand-secondarytext">
              The principles that guide our culture and career opportunities.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <div
                  key={v.title}
                  className="rounded-xl border border-brand-border bg-white p-6 shadow-xs"
                >
                  <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4 font-bold">
                    <Icon size={20} />
                  </div>
                  <h3 className="text-base font-bold text-brand-deeptext">
                    {v.title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-brand-secondarytext leading-relaxed">
                    {v.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ====== CLEAN MINIMAL CTA ====== */}
      <section className="bg-primary text-white py-12 sm:py-16 text-center">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Join the Humana Team Today
          </h2>
          <p className="mt-3 text-sm sm:text-base text-white/90 max-w-lg mx-auto">
            Explore open opportunities or learn more about our employee total
            rewards package.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link to="/apply">
              <Button
                size="md"
                variant="outline-white"
                rightIcon={<ArrowRight size={16} className="text-white" />}
                className="font-medium text-sm px-7 py-3 rounded-xl border-white bg-white text-primary hover:bg-neutral-100 shadow-sm"
              >
                Apply Now
              </Button>
            </Link>
            <Link to="/benefits">
              <Button
                size="md"
                variant="outline-white"
                className="font-medium text-sm px-7 py-3 rounded-xl border-white/50 text-white hover:bg-white/10"
              >
                View Employee Benefits
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
