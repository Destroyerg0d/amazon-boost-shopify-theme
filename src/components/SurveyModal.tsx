import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { UserSurvey } from '@/components/UserSurvey';

interface SurveyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export const SurveyModal = ({ isOpen, onClose, onComplete }: SurveyModalProps) => {
  const [isSkipping, setIsSkipping] = useState(false);

  const handleSkip = () => {
    setIsSkipping(true);
    onComplete();
    onClose();
  };

  const handleSurveyComplete = () => {
    onComplete();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle>Welcome! Help us personalize your experience</DialogTitle>
            <Button 
              variant="ghost" 
              onClick={handleSkip}
              disabled={isSkipping}
              className="text-muted-foreground"
            >
              Skip for now
            </Button>
          </div>
        </DialogHeader>
        <UserSurvey onComplete={handleSurveyComplete} showSkipButton={false} />
      </DialogContent>
    </Dialog>
  );
};