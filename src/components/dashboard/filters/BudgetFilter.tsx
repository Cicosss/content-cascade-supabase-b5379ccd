
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface BudgetFilterProps {
  selectedBudgets: string[];
  onBudgetsChange: (budgets: string[]) => void;
}

const BudgetFilter: React.FC<BudgetFilterProps> = ({ selectedBudgets, onBudgetsChange }) => {
  const budgetOptions = ['€0-25', '€25-50', '€50-100', '€100+'];

  const toggleBudget = (budget: string) => {
    let newBudgets;
    if (selectedBudgets.includes(budget)) {
      newBudgets = selectedBudgets.filter(b => b !== budget);
    } else {
      newBudgets = [...selectedBudgets, budget];
    }
    onBudgetsChange(newBudgets);
  };

  return (
    <div className="space-y-3">
      <Label className="font-semibold text-gray-700 flex items-center gap-2">
        💰 Budget per persona
      </Label>
      <div className="grid grid-cols-1 gap-2">
        {budgetOptions.map((budget) => (
          <Button
            key={budget}
            size="sm"
            variant={selectedBudgets.includes(budget) ? "default" : "outline"}
            onClick={() => toggleBudget(budget)}
            className={`justify-start text-sm ${
              selectedBudgets.includes(budget)
                ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg'
                : 'hover:bg-emerald-50 hover:border-emerald-300 border-2'
            }`}
          >
            {budget}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default BudgetFilter;
