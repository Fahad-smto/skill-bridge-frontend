"use client";

import { motion } from "framer-motion";
import HeroCarousel from "@/components/ui/HeroCarousel";
import Link from "next/link";
 
import { 
  Search, Users, BookOpen, Star, Calendar, 
  ChevronRight, Award, Clock, TrendingUp, 
  Headphones, GraduationCap, Video 
} from "lucide-react";
import Footer from "@/components/shared/Footer";

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, ease: "easeOut" }
};

const staggerContainer = {
  initial: {},
  whileInView: { transition: { staggerChildren: 0.1 } }
};

export default function HomePage() {
  return (
    <main className="overflow-x-hidden bg-white">
      {/* Hero Carousel */}
      <HeroCarousel />

      {/* Stats Section */}
      <section className="bg-slate-900 py-20 relative overflow-hidden mt-10 rounded-t-[3rem]">
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
          >
            {[
              { value: "10,000+", label: "Active Students", icon: Users },
              { value: "1,200+", label: "Expert Tutors", icon: GraduationCap },
              { value: "50+", label: "Subjects", icon: BookOpen },
              { value: "4.9", label: "Average Rating", icon: Star },
            ].map((stat, i) => (
              <motion.div key={i} variants={fadeInUp}>
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-blue-600/20 rounded-2xl">
                    <stat.icon className="w-8 h-8 text-blue-400" />
                  </div>
                </div>
                <div className="text-4xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-slate-400 text-sm font-medium uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Tutors Section */}
    

      {/* How It Works Section */}
      <section className="py-24 mt-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-gray-500">Get started with SkillBridge in three simple steps</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { step: "01", title: "Find a Tutor", icon: Search, color: "bg-blue-100 text-blue-600" },
              { step: "02", title: "Book a Session", icon: Calendar, color: "bg-purple-100 text-purple-600" },
              { step: "03", title: "Start Learning", icon: Video, color: "bg-emerald-100 text-emerald-600" },
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="text-center p-8 rounded-[2.5rem] bg-gray-50 border border-transparent hover:border-blue-200 transition-colors"
              >
                <div className={`w-20 h-20 ${item.color} rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm`}>
                  <item.icon className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600">Find the perfect mentor and start your journey towards excellence.</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className=" px-4 mt-16 mb-16">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="container mx-auto bg-gradient-to-br from-blue-600 to-indigo-800 rounded-[3rem] p-12 text-center text-white relative overflow-hidden shadow-2xl"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Boost Your Skills?</h2>
          <p className="text-blue-100 mb-10 max-w-xl mx-auto text-lg">
            Join thousands of students who are already transforming their lives with SkillBridge.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="bg-white text-blue-700 px-10 py-4 rounded-2xl font-bold hover:shadow-lg transition-all">
              Get Started Free
            </Link>
            <Link href="/tutors" className="border-2 border-white/30 text-white px-10 py-4 rounded-2xl font-bold hover:bg-white/10 transition-all">
              Browse Tutors
            </Link>
          </div>
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}