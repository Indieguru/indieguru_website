import React, { useState } from "react";
import { Button } from "../components/ui/button";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { Copy, Check, Share2 } from "lucide-react";

function ReferPage() {
  // For future navigation needs
  const [copied, setCopied] = useState(false);

  // Example referral code and URL
  const referralCode = "INDIE25MAY";
  const referralUrl = `https://indieguru.com/signup?ref=${referralCode}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOptions = [
    {
      name: "WhatsApp",
      icon: "/whatsapp.svg",
      bgColor: "bg-green-500",
      action: () => window.open(`https://wa.me/?text=${encodeURIComponent(`Join me on IndieGuru! Use my referral code: ${referralCode}. ${referralUrl}`)}`)
    },
    {
      name: "Twitter",
      icon: "/twitter.svg",
      bgColor: "bg-blue-400",
      action: () => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`I'm learning with IndieGuru! Join me using my referral code: ${referralCode}. ${referralUrl}`)}`)
    },
    {
      name: "LinkedIn",
      icon: "/linkedin.svg",
      bgColor: "bg-blue-700",
      action: () => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralUrl)}&title=${encodeURIComponent('Join me on IndieGuru')}`)
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      <Header />

      <main className="max-w-6xl mx-auto px-4 pt-28 pb-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-indigo-900 mb-4">Refer Friends & Earn Rewards</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Share IndieGuru with your friends and colleagues. For every successful referral, you both get rewards!
          </p>
        </div>

        {/* Referral Methods */}
        <div className="bg-white p-8 rounded-xl shadow-md flex flex-col max-w-2xl mx-auto">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Share Your Referral Link</h2>
          
          {/* Copy Link */}
          <div className="mb-8">
            <p className="text-sm text-gray-500 mb-2">Your unique referral link</p>
            <div className="flex">
              <input 
                type="text" 
                value={referralUrl}
                readOnly
                className="flex-grow p-3 border rounded-l-lg text-gray-700 bg-gray-50"
              />
              <Button 
                onClick={handleCopyLink}
                className="bg-blue-700 hover:bg-blue-800 rounded-r-lg"
              >
                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </Button>
            </div>
            {copied && <p className="text-green-600 text-xs mt-1">Copied to clipboard!</p>}
          </div>
          
          {/* Social Sharing */}
          <div>
            <p className="text-sm text-gray-500 mb-3">Or share via</p>
            <div className="flex gap-4">
              {shareOptions.map((option) => (
                <button
                  key={option.name}
                  onClick={option.action}
                  className={`${option.bgColor} text-white p-3 rounded-full hover:opacity-90 transition-opacity`}
                >
                  <img src={option.icon} alt={option.name} className="w-5 h-5" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default ReferPage;
