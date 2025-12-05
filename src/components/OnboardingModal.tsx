import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import IndustrySetup from './IndustrySetup';

interface OnboardingModalProps {
  isOpen: boolean;
  onIndustrySelect: (industry: string) => void;
}

const industries = [
  { id: 'hospitality', name: 'Hospitality', subtitle: 'Lounge, Bar, Hotel, Restaurant', icon: '🏨', group: 'GROUP 1' },
  { id: 'retail', name: 'Retail & Supermarket', subtitle: 'Stores, Markets, QSR', icon: '🛒', group: 'GROUP 1' },
  { id: 'healthcare', name: 'Healthcare', subtitle: 'Hospital, Pharmacy, Clinic', icon: '🏥', group: 'GROUP 2' },
  { id: 'education', name: 'Education', subtitle: 'School, University, Ministry', icon: '🎓', group: 'GROUP 3' },
  { id: 'office', name: 'Office/Administration', subtitle: 'Corporate, NGO, Admin', icon: '🏢', group: 'GROUP 3' },
  { id: 'agriculture', name: 'Agriculture/Farming', subtitle: 'Farm, Livestock, Agro', icon: '🌾', group: 'GROUP 4' },
  { id: 'manufacturing', name: 'Manufacturing', subtitle: 'Factory, Construction', icon: '🏭', group: 'GROUP 5' },
  { id: 'general', name: 'General Purpose', subtitle: 'Multi-Industry, Custom', icon: '⚙️', group: 'GROUP 6' },
];

const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onIndustrySelect }) => {
  const [selectedIndustry, setSelectedIndustry] = useState<string>('');
  const [showSetup, setShowSetup] = useState(false);

  const handleSelect = (industryId: string) => {
    setSelectedIndustry(industryId);
  };

  const handleContinue = () => {
    if (selectedIndustry) {
      setShowSetup(true);
    }
  };

  const handleFinishSetup = () => {
    onIndustrySelect(selectedIndustry);
  };

  const handleBack = () => {
    setShowSetup(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        {!showSetup ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-center mb-4">
                Welcome to Mi-Inventory Pro
              </DialogTitle>
              <p className="text-center text-muted-foreground mb-6">
                Please select your industry to help us preconfigure your setup
              </p>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {industries.map((industry) => (
                <Card 
                  key={industry.id}
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    selectedIndustry === industry.id ? 'ring-2 ring-primary bg-primary/5' : ''
                  }`}
                  onClick={() => handleSelect(industry.id)}
                >
                  <CardContent className="p-4 text-center">
                    <Badge variant="outline" className="mb-2 text-xs">
                      {industry.group}
                    </Badge>
                    <div className="text-3xl mb-2">{industry.icon}</div>
                    <h3 className="font-semibold mb-1">{industry.name}</h3>
                    <p className="text-sm text-muted-foreground">{industry.subtitle}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="flex justify-center">
              <Button 
                onClick={handleContinue}
                disabled={!selectedIndustry}
                size="lg"
                className="px-8"
              >
                Continue Setup
              </Button>
            </div>
          </>
        ) : (
          <>
            <IndustrySetup industryId={selectedIndustry} />
            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
              <Button onClick={handleFinishSetup} size="lg" className="px-8">
                Complete Setup
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingModal;