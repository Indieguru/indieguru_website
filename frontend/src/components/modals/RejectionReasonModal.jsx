import { Dialog } from '../ui/dialog';
import { Button } from '../ui/button';
import { X } from 'lucide-react';

export default function RejectionReasonModal({ isOpen, onClose, reason }) {
  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Rejection Reason">
      <div className="p-6">
        <div className="mb-6">
          <div className="bg-red-50 text-red-700 p-4 rounded-lg">
            {reason || 'No reason provided'}
          </div>
        </div>
        <div className="flex justify-end">
          <Button
            onClick={onClose}
            className="bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            <span>Close</span>
          </Button>
        </div>
      </div>
    </Dialog>
  );
}