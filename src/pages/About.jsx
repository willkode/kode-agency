import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import Section from '@/components/ui-custom/Section';
import Card from '@/components/ui-custom/Card';
import { Users, Zap, Heart } from 'lucide-react';

export default function AboutPage() {
  return (
    <div>
      <Section className="pt-32 pb-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">About Us</h1>
        <p className="text-xl text-slate-400 max-w-3xl mx-auto">
          We are a team of product thinkers and engineers obsessed with shipping software faster.
        </p>
      </Section>

      <Section>
         <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
               <h2 className="text-3xl font-bold text-white mb-6">Why we started</h2>
               <p className="text-slate-400 mb-4 leading-relaxed">
                  Traditional software development is broken. It takes too long, costs too much, and often results in over-engineered products that nobody uses.
               </p>
               <p className="text-slate-400 mb-4 leading-relaxed">
                  We saw the rise of AI and platforms like Base44 and realized there was a better way. By leveraging these tools, we can deliver serious, production-grade software in a fraction of the time.
               </p>
               <p className="text-slate-400 leading-relaxed">
                  We're not just coders. We're partners in your product journey.
               </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
               <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop" className="rounded-2xl shadow-2xl mb-4" alt="Team working" />
               <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2070&auto=format&fit=crop" className="rounded-2xl shadow-2xl mt-8" alt="Office meeting" />
            </div>
         </div>
      </Section>

      <Section className="bg-slate-900/50">
         <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Our Values</h2>
         </div>
         <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-8">
               <div className="w-12 h-12 bg-indigo-600/20 text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Zap className="w-6 h-6" />
               </div>
               <h3 className="text-xl font-bold text-white mb-4">Ship Fast</h3>
               <p className="text-slate-400">We believe working software is the only measure of progress. We aim to put something in your hands week 1.</p>
            </Card>
            <Card className="text-center p-8">
               <div className="w-12 h-12 bg-violet-600/20 text-violet-400 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-6 h-6" />
               </div>
               <h3 className="text-xl font-bold text-white mb-4">Honest Feedback</h3>
               <p className="text-slate-400">We're not "yes men". If we think a feature is unnecessary or a direction is wrong, we'll tell you.</p>
            </Card>
            <Card className="text-center p-8">
               <div className="w-12 h-12 bg-pink-600/20 text-pink-400 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Heart className="w-6 h-6" />
               </div>
               <h3 className="text-xl font-bold text-white mb-4">Long Term</h3>
               <p className="text-slate-400">We don't just build and run. We want to be your long-term technical partner as you grow.</p>
            </Card>
         </div>
      </Section>

      <Section>
         <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">The Team</h2>
         </div>
         <div className="grid md:grid-cols-4 gap-8">
            {[
               { name: "Alex Chen", role: "Lead Architect", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop" },
               { name: "Sarah Jones", role: "Product Designer", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1000&auto=format&fit=crop" },
               { name: "Mike Ross", role: "Automation Specialist", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1000&auto=format&fit=crop" },
               { name: "Emily Tao", role: "Full Stack Dev", img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1000&auto=format&fit=crop" },
            ].map((member) => (
               <div key={member.name} className="text-center group">
                  <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden ring-2 ring-slate-800 group-hover:ring-indigo-500 transition-all">
                     <img src={member.img} alt={member.name} className="w-full h-full object-cover" />
                  </div>
                  <h3 className="text-white font-bold text-lg">{member.name}</h3>
                  <p className="text-slate-500 text-sm">{member.role}</p>
               </div>
            ))}
         </div>
      </Section>

      <Section className="text-center py-20">
         <h2 className="text-3xl font-bold text-white mb-8">Ready to work with us?</h2>
         <Link to={createPageUrl('Contact')}>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white h-12 px-8 rounded-full">
               Get in Touch
            </Button>
         </Link>
      </Section>
    </div>
  );
}