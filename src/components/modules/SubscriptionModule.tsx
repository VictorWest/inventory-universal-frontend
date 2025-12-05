import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Check, Star, Zap, Building } from 'lucide-react';

const SubscriptionModule: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState('free');

  const plans = [
    {
      id: 'free',
      name: 'Free Trial',
      price: '₦0',
      duration: '30 Days',
      icon: <Star className="h-6 w-6" />,
      features: [
        '1 Store location',
        '2 Departments',
        '5 Users',
        'Full Inventory Management',
        'Sales (Direct & Table-Based)',
        'Cost Calculation',
        'Basic Reports',
        'System Alerts'
      ],
      popular: false
    },
    {
      id: 'basic',
      name: 'Basic Plan',
      price: '₦10,000',
      duration: '/month',
      icon: <Zap className="h-6 w-6" />,
      features: [
        '1 Branch',
        'Up to 3 Departments',
        'Up to 10 Users',
        'Inventory Management',
        'Direct Sales only',
        'Basic Reports',
        'Cost Calculation',
        'Limited customization'
      ],
      popular: false
    },
    {
      id: 'standard',
      name: 'Standard Plan',
      price: '₦20,000',
      duration: '/month',
      icon: <Crown className="h-6 w-6" />,
      features: [
        '3 Branches',
        'Up to 10 Departments',
        'Up to 25 Users',
        'Table-Based Sales System',
        'Expiry & Batch Tracking',
        'Full Payment History',
        'PDF Export',
        'Stock write-off system'
      ],
      popular: true
    },
    {
      id: 'premium',
      name: 'Premium Plan',
      price: '₦40,000',
      duration: '/month',
      icon: <Building className="h-6 w-6" />,
      features: [
        'Unlimited Branches',
        'Unlimited Departments',
        'Unlimited Users',
        'Multi-store inventory transfer',
        'Asset tagging',
        'Stock Forecasting',
        'API Integration',
        'Priority support'
      ],
      popular: false
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold">Choose Your Plan</h2>
        <p className="text-gray-600 mt-2">Select the perfect plan for your business needs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan) => (
          <Card 
            key={plan.id} 
            className={`relative cursor-pointer transition-all hover:shadow-lg ${
              selectedPlan === plan.id ? 'ring-2 ring-blue-500' : ''
            } ${plan.popular ? 'border-blue-500' : ''}`}
            onClick={() => setSelectedPlan(plan.id)}
          >
            {plan.popular && (
              <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-blue-500">
                Most Popular
              </Badge>
            )}
            
            <CardHeader className="text-center">
              <div className="flex justify-center mb-2">
                {plan.icon}
              </div>
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              <div className="text-2xl font-bold text-blue-600">
                {plan.price}
                <span className="text-sm text-gray-500">{plan.duration}</span>
              </div>
            </CardHeader>
            
            <CardContent>
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
              
              <Button 
                className={`w-full mt-4 ${
                  selectedPlan === plan.id 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : 'bg-gray-600 hover:bg-gray-700'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  // Handle subscription logic here
                }}
              >
                {plan.id === 'free' ? 'Start Free Trial' : 'Subscribe Now'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Enterprise/Custom Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Tailored for large organizations or multi-country operations with dedicated cloud instance, 
            white-label options, advanced analytics, and dedicated account manager.
          </p>
          <Button variant="outline">
            Contact Sales
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionModule;