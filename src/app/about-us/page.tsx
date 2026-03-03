import Link from 'next/link'

const stats = [
  { value: '10,000+', label: 'Students Enrolled', emoji: '👨‍🎓' },
  { value: '1,200+', label: 'Expert Tutors', emoji: '👨‍🏫' },
  { value: '50+', label: 'Subjects Available', emoji: '📚' },
  { value: '4.9★', label: 'Average Rating', emoji: '⭐' },
]

const team = [
  {
    name: 'Rahim Ahmed',
    role: 'Founder & CEO',
    emoji: '👨‍💼',
    bio: 'Former educator with 10+ years of experience in EdTech.',
  },
  {
    name: 'Fatima Khan',
    role: 'Head of Engineering',
    emoji: '👩‍💻',
    bio: 'Full-stack engineer passionate about building tools for learners.',
  },
  {
    name: 'Karim Hossain',
    role: 'Head of Tutors',
    emoji: '👨‍🏫',
    bio: 'Dedicated to recruiting and supporting the best tutors.',
  },
  {
    name: 'Nadia Islam',
    role: 'Head of Design',
    emoji: '👩‍🎨',
    bio: 'Creates beautiful, accessible experiences for students and tutors.',
  },
]

const values = [
  {
    emoji: '🎯',
    title: 'Student First',
    desc: 'Every decision we make starts with the student in mind. We exist to help learners reach their full potential.',
  },
  {
    emoji: '✅',
    title: 'Quality Tutors',
    desc: 'Every tutor is verified and reviewed. We maintain high standards so students always get the best experience.',
  },
  {
    emoji: '💡',
    title: 'Accessible Learning',
    desc: 'We believe great education should be available to everyone, regardless of location or background.',
  },
  {
    emoji: '🤝',
    title: 'Trust & Safety',
    desc: 'A safe, transparent platform where students and tutors can connect with complete confidence.',
  },
]

const timeline = [
  { year: '2021', title: 'SkillBridge Founded', desc: 'Started with 10 tutors and a dream to make quality education accessible.' },
  { year: '2022', title: '1,000 Students', desc: 'Reached our first major milestone with students across Bangladesh.' },
  { year: '2023', title: 'Mobile App Launch', desc: 'Launched iOS and Android apps, making learning truly on-the-go.' },
  { year: '2024', title: '10,000+ Students', desc: 'Grew to over 10,000 active students and 1,200 verified tutors.' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* ── Hero ── */}
      <div className="bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 py-24 px-6 text-center relative overflow-hidden">
        {/* Grid background */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
        {/* Orb */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

        <div className="relative max-w-3xl mx-auto space-y-5">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-white/70 text-sm">
            🚀 Our Story
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight">
            We are on a mission to{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
              democratize learning
            </span>
          </h1>
          <p className="text-white/50 text-lg max-w-xl mx-auto leading-relaxed">
            SkillBridge connects passionate learners with expert tutors — making quality education accessible to everyone, everywhere.
          </p>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="text-center bg-gray-50 rounded-2xl p-6 border border-gray-100"
            >
              <div className="text-3xl mb-2">{stat.emoji}</div>
              <div className="text-3xl font-bold text-zinc-900">{stat.value}</div>
              <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Our Story ── */}
      <div className="bg-gray-50 py-20 px-6">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-5">
            <div className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide">
              Our Story
            </div>
            <h2 className="text-4xl font-bold text-zinc-900 leading-tight">
              Born from a passion for better education
            </h2>
            <p className="text-gray-500 leading-relaxed">
              SkillBridge was founded in 2021 by a group of educators and engineers who believed that every student deserves access to a great tutor — not just those who can afford expensive coaching centers.
            </p>
            <p className="text-gray-500 leading-relaxed">
              We built a platform where students can find verified, passionate tutors in any subject, book sessions instantly, and learn at their own pace — all from the comfort of their home.
            </p>
            <Link
              href="/tutors"
              className="inline-flex items-center gap-2 bg-zinc-900 text-white font-semibold px-6 py-3 rounded-xl hover:bg-zinc-700 transition-colors"
            >
              Find a Tutor →
            </Link>
          </div>

          {/* Timeline */}
          <div className="space-y-4">
            {timeline.map((item, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="shrink-0 w-14 h-14 rounded-xl bg-zinc-900 text-white flex items-center justify-center text-xs font-bold">
                  {item.year}
                </div>
                <div className="pt-1">
                  <h4 className="font-semibold text-zinc-900">{item.title}</h4>
                  <p className="text-sm text-gray-500 mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Values ── */}
      <div className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 space-y-3">
            <div className="inline-block bg-indigo-100 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide">
              Our Values
            </div>
            <h2 className="text-4xl font-bold text-zinc-900">What we stand for</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Our values guide every decision we make — from how we build our product to how we treat our community.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((val) => (
              <div
                key={val.title}
                className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:border-zinc-300 hover:shadow-sm transition-all"
              >
                <div className="text-3xl mb-4">{val.emoji}</div>
                <h3 className="font-semibold text-zinc-900 mb-2">{val.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Team ── */}
      <div className="bg-gray-50 py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 space-y-3">
            <div className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide">
              Our Team
            </div>
            <h2 className="text-4xl font-bold text-zinc-900">Meet the people behind SkillBridge</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              A small but mighty team of educators, engineers, and designers.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member) => (
              <div
                key={member.name}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center hover:shadow-md transition-all"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center text-3xl mx-auto mb-4">
                  {member.emoji}
                </div>
                <h3 className="font-semibold text-zinc-900">{member.name}</h3>
                <p className="text-xs text-blue-600 font-medium mt-0.5">{member.role}</p>
                <p className="text-xs text-gray-500 mt-3 leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="py-20 px-6">
        <div className="max-w-3xl mx-auto bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-3xl p-12 text-center space-y-6">
          <h2 className="text-4xl font-bold text-white">
            Ready to start learning?
          </h2>
          <p className="text-white/50 max-w-md mx-auto">
            Join thousands of students already learning with SkillBridge. Find your perfect tutor today.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link
              href="/tutors"
              className="bg-white text-zinc-900 font-semibold px-6 py-3 rounded-xl hover:bg-white/90 transition-colors"
            >
              Browse Tutors →
            </Link>
            <Link
              href="/register"
              className="border border-white/20 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/10 transition-colors"
            >
              Become a Tutor
            </Link>
          </div>
        </div>
      </div>

    </div>
  )
}
 