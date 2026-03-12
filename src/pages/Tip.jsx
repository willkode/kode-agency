import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import Card from "@/components/ui-custom/Card";
import PageHero from "@/components/ui-custom/PageHero";
import Section from "@/components/ui-custom/Section";
import GridBackground from "@/components/ui-custom/GridBackground";
import SectionLabel from "@/components/ui-custom/SectionLabel";
import GlowingOrb from "@/components/ui-custom/GlowingOrb";
import FloatingPixels from "@/components/ui-custom/FloatingPixels";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart, DollarSign, Coffee, Sparkles } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { base44 } from '@/api/base44Client';
import SEO from "@/components/SEO";
import { createBreadcrumbSchema } from "@/components/SEO";

export default function Tip() {
  const { toast } = useToast();
  const [customAmount, setCustomAmount] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const quickAmounts = [5, 10, 25, 50, 100];

  const handleTip = async (amount) => {
    if (!amount || amount < 1) {
      toast({
        title: "Invalid amount",
        description: "Please enter an amount of at least $1",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const response = await base44.functions.invoke('createTipCheckout', {
        amount: amount,
        name: name || 'Anonymous',
        message: message || ''
      });

      if (response.data.url) {
        window.location.href = response.data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (error) {
      console.error('Tip error:', error);
      toast({
        title: "Error",
        description: "Failed to process tip. Please try again.",
        variant: "destructive"
      });
      setLoading(false);
    }
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      createBreadcrumbSchema([
        { name: "Home", url: "/" },
        { name: "Send a Tip", url: "/Tip" }
      ])
    ]
  };

  return (
    <div className="bg-slate-950 text-white">
      <SEO 
        title="Send a Tip - Support Our Work"
        description="Send a tip to show your appreciation for our help and services. Every contribution helps us continue providing great support."
        url="/Tip"
        jsonLd={jsonLd}
      />
      
      <PageHero title="Send a Tip" subtitle="Show your appreciation" />

      <Section className="py-24 relative overflow-hidden">
        <GridBackground />
        <FloatingPixels count={20} />
        <GlowingOrb position="top-right" size="400px" opacity={0.1} />
        
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#73e28a]/20 mb-6">
              <Heart className="w-10 h-10 text-[#73e28a]" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Thanks for considering a tip!
            </h2>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto">
              Your support helps us continue providing quality assistance and building great tools for the community.
            </p>
          </div>

          <Card className="p-8 bg-slate-900/80 border-[#73e28a]/30">
            {/* Quick Amount Selection */}
            <div className="mb-8">
              <Label className="text-white text-lg font-bold mb-4 block">
                Choose an amount
              </Label>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                {quickAmounts.map((amount) => (
                  <Button
                    key={amount}
                    onClick={() => handleTip(amount)}
                    disabled={loading}
                    className="h-16 bg-slate-800 hover:bg-[#73e28a] hover:text-black border-2 border-slate-700 hover:border-[#73e28a] font-bold text-lg transition-all"
                  >
                    ${amount}
                  </Button>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4 mb-8">
              <div className="flex-1 h-px bg-slate-800"></div>
              <span className="text-slate-500 text-sm">OR</span>
              <div className="flex-1 h-px bg-slate-800"></div>
            </div>

            {/* Custom Amount */}
            <div className="mb-6">
              <Label htmlFor="custom-amount" className="text-white font-bold mb-2 block">
                Custom amount
              </Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  id="custom-amount"
                  type="number"
                  min="1"
                  step="1"
                  placeholder="Enter amount"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="pl-10 h-12 bg-slate-800 border-slate-700 text-white"
                />
              </div>
            </div>

            {/* Optional Name */}
            <div className="mb-6">
              <Label htmlFor="name" className="text-white font-bold mb-2 block">
                Your name (optional)
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Anonymous"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-12 bg-slate-800 border-slate-700 text-white"
              />
            </div>

            {/* Optional Message */}
            <div className="mb-8">
              <Label htmlFor="message" className="text-white font-bold mb-2 block">
                Message (optional)
              </Label>
              <textarea
                id="message"
                rows="3"
                placeholder="Leave a kind message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#73e28a] focus:border-transparent"
              />
            </div>

            {/* Submit Custom Amount */}
            <Button
              onClick={() => handleTip(parseFloat(customAmount))}
              disabled={loading || !customAmount}
              className="w-full h-14 bg-[#73e28a] hover:bg-[#5dbb72] text-black font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-3 border-black border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </div>
              ) : (
                <>
                  <Heart className="w-5 h-5 mr-2" />
                  Send Tip
                </>
              )}
            </Button>

            <p className="text-slate-400 text-sm text-center mt-4">
              Secure payment processed by Stripe
            </p>
          </Card>

          {/* Why Tips Matter */}
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <Card className="p-6 bg-slate-900/50 text-center">
              <Coffee className="w-8 h-8 text-[#73e28a] mx-auto mb-3" />
              <h3 className="text-white font-bold mb-2">Fuel the work</h3>
              <p className="text-slate-400 text-sm">
                Tips help cover costs and keep us motivated
              </p>
            </Card>
            
            <Card className="p-6 bg-slate-900/50 text-center">
              <Sparkles className="w-8 h-8 text-[#73e28a] mx-auto mb-3" />
              <h3 className="text-white font-bold mb-2">Build more tools</h3>
              <p className="text-slate-400 text-sm">
                Your support enables new features and services
              </p>
            </Card>
            
            <Card className="p-6 bg-slate-900/50 text-center">
              <Heart className="w-8 h-8 text-[#73e28a] mx-auto mb-3" />
              <h3 className="text-white font-bold mb-2">Show appreciation</h3>
              <p className="text-slate-400 text-sm">
                Let us know our help made a difference
              </p>
            </Card>
          </div>
        </div>
      </Section>
    </div>
  );
}