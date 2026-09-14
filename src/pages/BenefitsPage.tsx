import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Landmark,
  HeartPulse,
  GraduationCap,
  Clock,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
} from "lucide-react";
import Button from "../components/ui/Button";

const highlights = [
  {
    icon: Landmark,
    title: "100% 401(k) Match up to 6%",
    desc: "Dollar-for-dollar matching starting on Day 1, with immediate 100% vesting and personal financial guidance.",
    badge: "Financial Security",
  },
  {
    icon: HeartPulse,
    title: "Day-One Health & Wellness",
    desc: "Comprehensive medical, prescription, dental, and vision coverage effective your very first day.",
    badge: "Health Protection",
  },
  {
    icon: GraduationCap,
    title: "Tuition Assistance & Growth",
    desc: "Up to $5,250/yr in tuition reimbursement plus 100% funded clinical and IT certifications.",
    badge: "Career Growth",
  },
  {
    icon: Clock,
    title: "Generous PTO & Parental Leave",
    desc: "20–25 days paid time off, 12 paid holidays, 12 weeks 100% paid parental leave, and hybrid flexibility.",
    badge: "Work-Life Balance",
  },
];

const detailedPillars = [
  {
    id: "finance",
    title: "Financial Security & 401(k)",
    icon: Landmark,
    description:
      "Humana offers a top-tier financial package designed to protect your income and build long-term wealth.",
    items: [
      {
        title: "100% 401(k) Match up to 6%",
        detail:
          "Humana matches dollar-for-dollar up to 6% of your salary. 100% vested immediately on Day 1.",
      },
      {
        title: "Annual Bonuses & Merit Increases",
        detail:
          "Competitive base salaries backed by regular market performance reviews and merit bonuses.",
      },
      {
        title: "HSA Employer Contributions",
        detail:
          "Annual employer contributions paid directly into your tax-advantaged Health Savings Account.",
      },
      {
        title: "Free Financial Advisory",
        detail:
          "1-on-1 confidential consultations with certified financial planners for retirement and savings goals.",
      },
      {
        title: "Stock Purchase Plan (ESPP)",
        detail:
          "Purchase Humana stock at a discounted rate through convenient automatic payroll deductions.",
      },
      {
        title: "Paid Life & Disability Insurance",
        detail:
          "Company-paid basic life insurance (1.5x salary) plus comprehensive short & long-term disability.",
      },
    ],
  },
  {
    id: "health",
    title: "Health, Medical & Family Protection",
    icon: HeartPulse,
    description:
      "Comprehensive healthcare coverage starting on your very first day of employment with zero waiting period.",
    items: [
      {
        title: "Day-One Medical, Dental & Vision",
        detail:
          "Full medical, dental, and vision benefits start on your first working day with extensive provider networks.",
      },
      {
        title: "Free Mental Health & Counseling",
        detail:
          "Up to 12 free therapy and coaching sessions per year per issue for you and family members.",
      },
      {
        title: "Fertility & Family Building",
        detail:
          "Up to $10,000 reimbursement for adoption expenses, plus coverage for fertility treatments.",
      },
      {
        title: "Annual Wellness Rewards",
        detail:
          "Earn up to $500 annually in gift cards for participating in simple healthy activities and checkups.",
      },
      {
        title: "24/7 Virtual Telehealth Care",
        detail:
          "Free, round-the-clock telehealth visits for urgent care, pediatric needs, and routine consultations.",
      },
      {
        title: "Prescription Home Delivery",
        detail:
          "Affordable prescription drug tiers with convenient 90-day mail-order options and free shipping.",
      },
    ],
  },
  {
    id: "growth",
    title: "Education & Career Advancement",
    icon: GraduationCap,
    description:
      "Investments in your personal skill set, credentials, and career trajectory at every stage.",
    items: [
      {
        title: "Tuition Assistance Program",
        detail:
          "Up to $5,250 annually for undergraduate and graduate degrees at accredited universities.",
      },
      {
        title: "Sponsored Professional Certifications",
        detail:
          "100% covered specialized credentials including RN BSN, cloud engineering, and leadership badges.",
      },
      {
        title: "Humana Leadership Academy",
        detail:
          "Targeted cohort-based leadership development for high-potential team members.",
      },
      {
        title: "Internal Career Mobility",
        detail:
          "Priority internal consideration across clinical care, data science, tech, and operations.",
      },
      {
        title: "Paid Continuing Education (CEUs)",
        detail:
          "Paid hours and licensure fee coverage for nurses, pharmacists, and medical practitioners.",
      },
      {
        title: "Executive Mentorship Program",
        detail:
          "Structured mentor matching connecting you with experienced leaders for career guidance.",
      },
    ],
  },
  {
    id: "balance",
    title: "Work-Life Harmony & Leave",
    icon: Clock,
    description:
      "Generous paid leave policies and flexible work options designed around your personal life.",
    items: [
      {
        title: "100% Remote-First & Home Office Support",
        detail:
          "Work from anywhere with home office equipment stipends and complete technology setup support.",
      },
      {
        title: "20 to 25 Days Paid Time Off",
        detail:
          "Generous PTO starting on day one with annual accrual increases based on tenure.",
      },
      {
        title: "12 Paid Corporate Holidays",
        detail:
          "Includes official company holidays and floating holidays for personal cultural observances.",
      },
      {
        title: "12 Weeks Paid Parental Leave",
        detail:
          "100% paid leave for birthing, non-birthing, and adoptive parents to bond with new children.",
      },
      {
        title: "Paid Caregiver Leave",
        detail:
          "Dedicated paid time off to assist and care for family members experiencing serious health conditions.",
      },
      {
        title: "Volunteer Time Off (VTO)",
        detail:
          "8 paid hours per year to volunteer and serve in your local community.",
      },
    ],
  },
];

const faqs = [
  {
    q: "Are 100% remote work options available?",
    a: "Yes! The vast majority of our positions are 100% remote-first. Humana provides home office equipment support, technology stipends, and complete flexibility to work from home.",
  },
  {
    q: "When do my Humana health and insurance benefits begin?",
    a: "Your medical, dental, vision, and life insurance benefits start on your very first day of official employment (Day 1). There is zero waiting period.",
  },
  {
    q: "How does the 401(k) company match work?",
    a: "Humana provides a 100% dollar-for-dollar match on your contributions up to 6% of your pay. Employer contributions are 100% immediately vested on Day 1.",
  },
  {
    q: "Who is eligible for tuition assistance?",
    a: "Employees with 90 days of service can access up to $5,250 per year for undergraduate or graduate degrees, plus fully sponsored job-related certifications.",
  },
];

export default function BenefitsPage() {
  const [activeTab, setActiveTab] = useState("finance");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const activePillar =
    detailedPillars.find((p) => p.id === activeTab) || detailedPillars[0];

  return (
    <div className="bg-white text-brand-deeptext min-h-screen">
      {/* ====== CLEAN MINIMAL HERO ====== */}
      <section className="border-b border-brand-border/60 bg-[#FAFCF8] py-10 sm:py-14">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-block text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full mb-4">
              Total Rewards & Employee Benefits
            </span>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-brand-deeptext tracking-tight leading-tight">
              Employee Benefits & Compensation
            </h1>

            <p className="mt-4 text-base sm:text-lg text-brand-secondarytext leading-relaxed font-normal max-w-2xl mx-auto">
              We offer industry-leading financial security, day-one health
              coverage, and tuition support designed to help you and your family
              thrive.
            </p>

            {/* TRUST INDICATORS — ONE CLEAN SINGLE LINE */}
            <div className="mt-8 pt-5 border-t border-brand-border/60 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-medium text-brand-secondarytext">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={15} className="text-primary shrink-0" />
                <span>100% 401(k) Match up to 6%</span>
              </span>
              <span className="text-neutral-300 hidden sm:inline">•</span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={15} className="text-primary shrink-0" />
                <span>Day-One Healthcare Coverage</span>
              </span>
              <span className="text-neutral-300 hidden sm:inline">•</span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={15} className="text-primary shrink-0" />
                <span>Tuition Reimbursement</span>
              </span>
              <span className="text-neutral-300 hidden sm:inline">•</span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={15} className="text-primary shrink-0" />
                <span>Immediate 100% Vesting</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ====== CORE HIGHLIGHT CARDS ====== */}
      <section className="py-12 sm:py-16 border-b border-brand-border bg-white">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="mb-10 text-center max-w-xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-brand-deeptext">
              Key Benefit Highlights
            </h2>
            <p className="mt-2 text-sm text-brand-secondarytext">
              Essential protections included with every full-time position.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {highlights.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="rounded-xl border border-brand-border bg-[#FAFCF8] p-6 hover:border-primary/40 hover:shadow-xs transition-all duration-200"
                >
                  <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4 font-bold">
                    <Icon size={20} />
                  </div>
                  <span className="text-[11px] font-semibold text-primary uppercase tracking-wider block mb-1">
                    {item.badge}
                  </span>
                  <h3 className="text-base font-bold text-brand-deeptext">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-brand-secondarytext leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ====== ENHANCED 401(K) MATCHING BENEFIT SECTION ====== */}
      <section
        id="breakdown"
        className="py-12 sm:py-16 bg-[#FAFCF8] border-b border-brand-border"
      >
        <div className="mx-auto max-w-4xl px-5 sm:px-8">
          <div className="space-y-6">
            <span className="inline-block text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">
              Retirement Benefits
            </span>

            <h2 className="text-2xl sm:text-3xl mb-2 font-bold text-brand-deeptext tracking-tight">
              Enhanced 401(k) Matching Benefit
            </h2>

            <p className="text-base sm:text-lg text-brand-secondarytext leading-relaxed font-normal">
              We’re committed to helping our employees build a stronger
              financial future. Under this enhanced 401(k) benefit, eligible
              employee contributions will receive a dollar-for-dollar employer
              match, effectively doubling each qualifying contribution, subject
              to applicable plan limits.
            </p>

            <p className="text-base sm:text-lg text-brand-secondarytext leading-relaxed font-normal">
              In addition, eligible existing 401(k) balances will receive an
              equivalent dollar-for-dollar employer contribution, effectively
              doubling the qualifying existing balance, subject to the terms,
              eligibility requirements, contribution limits, and applicable
              regulations of the plan.
            </p>

            <div className="border-l-4 border-primary pl-4 py-1 text-base font-medium text-brand-deeptext leading-relaxed">
              This enhanced retirement benefit is designed to significantly
              strengthen employees’ retirement savings and support greater
              long-term financial security.
            </div>

            {/* Breakdown of the two separate 401(k) benefits */}
            <div className="pt-6 border-t border-brand-border/60 space-y-4">
              <h3 className="text-base sm:text-lg font-bold text-brand-deeptext">
                How the Enhanced 401(k) Benefit Works:
              </h3>

              <div className="space-y-4 text-sm sm:text-base text-brand-secondarytext leading-relaxed">
                <div className="flex items-start gap-3">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs mt-0.5">
                    1
                  </span>
                  <div>
                    <strong className="text-brand-deeptext font-semibold">
                      New contributions:
                    </strong>{" "}
                    If an employee contributes an eligible amount to their
                    401(k), the company contributes the same amount, subject to
                    the plan limits. For example, an eligible $1,000 employee
                    contribution + $1,000 employer contribution = $2,000.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs mt-0.5">
                    2
                  </span>
                  <div>
                    <strong className="text-brand-deeptext font-semibold">
                      Money already in the 401(k):
                    </strong>{" "}
                    An employee’s qualifying existing 401(k) balance receives an
                    equal employer contribution. For example, if $20,000 of an
                    existing balance qualifies, the company contributes another
                    $20,000, resulting in $40,000, assuming the plan and legal
                    limits permit the full amount.
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-brand-border/60 flex flex-wrap items-center gap-6 text-xs sm:text-sm font-medium text-brand-secondarytext">
              <span className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-primary shrink-0" />
                <span>Dollar-for-Dollar Employer Match</span>
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-primary shrink-0" />
                <span>Immediate 100% Vesting</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ====== IN-DEPTH BENEFITS DIRECTORY (TABS) ====== */}
      <section className="py-12 sm:py-16 border-b border-brand-border bg-white">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="text-center max-w-xl mx-auto mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-brand-deeptext">
              Detailed Benefits Directory
            </h2>
            <p className="mt-2 text-sm text-brand-secondarytext">
              Explore coverage details across each major category.
            </p>
          </div>

          {/* Clean minimal tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            {detailedPillars.map((pillar) => {
              const Icon = pillar.icon;
              const isActive = activeTab === pillar.id;
              return (
                <button
                  key={pillar.id}
                  onClick={() => setActiveTab(pillar.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                    isActive
                      ? "bg-primary text-white"
                      : "bg-[#FAFCF8] text-brand-secondarytext border border-brand-border hover:bg-neutral-100"
                  }`}
                >
                  <Icon size={16} />
                  <span>{pillar.title}</span>
                </button>
              );
            })}
          </div>

          {/* Active Tab Content */}
          <div className="rounded-2xl border border-brand-border bg-[#FAFCF8] p-6 sm:p-8">
            <div className="max-w-2xl mb-6">
              <h3 className="text-xl font-bold text-brand-deeptext">
                {activePillar.title}
              </h3>
              <p className="mt-1 text-sm text-brand-secondarytext">
                {activePillar.description}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {activePillar.items.map((item) => (
                <div
                  key={item.title}
                  className="rounded-xl border border-brand-border bg-white p-5 shadow-xs"
                >
                  <div className="flex items-center gap-2 text-primary font-bold text-xs mb-2">
                    <CheckCircle2 size={16} />
                    <span>{item.title}</span>
                  </div>
                  <p className="text-xs text-brand-secondarytext leading-relaxed">
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ====== CLEAN MINIMAL FAQ ====== */}
      <section className="py-12 sm:py-16 border-b border-brand-border bg-[#FAFCF8]">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-brand-deeptext">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={faq.q}
                  className="rounded-xl border border-brand-border bg-white overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full text-left px-5 py-4 flex items-center justify-between gap-3 text-sm font-bold text-brand-deeptext hover:text-primary transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      size={18}
                      className={`text-neutral-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-primary" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-4 pt-0 text-xs sm:text-sm text-brand-secondarytext leading-relaxed">
                      {faq.a}
                    </div>
                  )}
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
            Ready to Start Your Career at Humana?
          </h2>
          <p className="mt-3 text-sm sm:text-base text-white/90 max-w-lg mx-auto">
            Complete your application in 10–12 minutes for direct consideration
            across clinical, tech, and corporate roles.
          </p>
          <div className="mt-6">
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
          </div>
        </div>
      </section>
    </div>
  );
}
