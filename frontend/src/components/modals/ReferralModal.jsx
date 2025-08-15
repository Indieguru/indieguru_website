import React, { useState } from 'react';
import { Modal } from '../ui/modal';
import { Button } from '../ui/button';
import { Copy, Share2, Users, CheckCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import useUserStore from '../../store/userStore';

function ReferralModal({ isOpen, onClose }) {
  const [copied, setCopied] = useState(false);
  const { user } = useUserStore();
  
  // Generate a unique referral link using actual user ID or fallback
  const userId = user?._id || user?.id || "user123";
  const referralLink = `https://indie-guru-website.vercel.app/signup?ref=${userId}`;
  
  const shareText = `🚀 Join me on IndieGuru - the ultimate platform to learn from industry experts! Get personalized mentoring, exclusive courses, and grow your career. Use my referral link and let's learn together! 🎓✨`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      toast.success('Referral link copied to clipboard!');
      
      // Reset copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
      toast.error('Failed to copy link');
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: 'Join IndieGuru - Learn from Industry Experts',
      text: shareText,
      url: referralLink,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: copy text and link to clipboard
        await navigator.clipboard.writeText(`${shareText}\n\n${referralLink}`);
        toast.success('Share text and link copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Invite Friends to IndieGuru" className="max-w-none w-[67vw]">
      <div className="bg-white rounded-lg overflow-hidden">
        <div className="flex flex-row min-h-[260px]">
          {/* Left Side - Illustration and Content */}
          <div className="w-2/5 bg-blue-50 p-6 flex flex-col justify-center items-center text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              Share the Knowledge
            </h2>
            <p className="text-gray-700 text-sm leading-relaxed max-w-xs mb-4">
              Invite your friends to join IndieGuru and help them connect with industry experts for personalized learning and career growth.
            </p>
            
            {/* Simple Benefits */}
            <div className="space-y-2">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-3 h-3 text-white" />
                </div>
                <span className="text-gray-700 text-sm font-medium">Expert mentorship</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-3 h-3 text-white" />
                </div>
                <span className="text-gray-700 text-sm font-medium">Learn together</span>
              </div>
            </div>
          </div>

          {/* Right Side - Referral Link and Actions */}
          <div className="w-3/5 p-6 flex flex-col justify-center">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Your Referral Link
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="flex-1 bg-gray-100 border border-gray-300 rounded-lg px-4 py-2.5">
                      <p className="text-sm text-gray-800 break-all font-mono">{referralLink}</p>
                    </div>
                    <Button
                      onClick={handleCopyLink}
                      className={`px-4 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                        copied
                          ? 'bg-green-600 hover:bg-green-700 text-white'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      {copied ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  
                  {copied && (
                    <div className="flex items-center space-x-2 text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">Link copied to clipboard!</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <Button
                  onClick={handleShare}
                  className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-colors duration-200"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share with Friends</span>
                </Button>
                
                <Button
                  onClick={onClose}
                  className="flex-1 bg-white border-2 border-gray-300 hover:bg-gray-50 text-gray-700 py-3 rounded-lg font-medium transition-colors duration-200"
                >
                  Close
                </Button>
              </div>

              {/* Footer Note */}
              <p className="text-xs text-gray-500 text-center leading-relaxed">
                Help your friends discover expert-led learning and grow their careers with IndieGuru.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default ReferralModal;
