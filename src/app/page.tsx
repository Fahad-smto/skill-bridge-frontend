// app/page.tsx (Home Page)
import HeroCarousel from "@/components/ui/HeroCarousel";

export default function HomePage() {
  return (
    <main>
      <HeroCarousel />
      
      {/* Your home page content */}
      <section className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-center mb-8">
          Welcome to SkillBridge
        </h1>
        <p className="text-center text-gray-600">
          Find the best tutors for your learning journey
        </p>
      </section>
    </main>
  )
}