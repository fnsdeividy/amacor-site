import { useState, useMemo } from 'react';
import type { AgeRange, SimulatedPlan, PlanPricing } from '../types';
import simulationPricingData from '../data/simulationPricing.json';

/**
 * Pure function that calculates the simulation price for a plan.
 * Formula: basePrice + (dependents × basePrice × dependentFactor)
 * Result is rounded to 2 decimal places.
 */
export function calculateSimulationPrice(
  ageRange: AgeRange,
  dependents: number,
  planPricing: PlanPricing,
  dependentFactor: number
): number {
  const basePrice = planPricing.priceByAge[ageRange];
  const total = basePrice + dependents * basePrice * dependentFactor;
  return Math.round(total * 100) / 100;
}

export interface UseSimulationReturn {
  ageRange: AgeRange | null;
  dependents: number;
  setAgeRange: (range: AgeRange) => void;
  setDependents: (count: number) => void;
  results: SimulatedPlan[] | null;
  isCalculating: boolean;
  reset: () => void;
}

/**
 * Hook that manages simulation state and computes plan pricing results.
 * Reads pricing data from simulationPricing.json and calculates estimated
 * monthly costs based on age range and number of dependents.
 */
export function useSimulation(): UseSimulationReturn {
  const [ageRange, setAgeRange] = useState<AgeRange | null>(null);
  const [dependents, setDependents] = useState<number>(0);

  const pricingData = simulationPricingData;

  const results = useMemo<SimulatedPlan[] | null>(() => {
    if (!ageRange || dependents < 0) return null;

    return pricingData.plans.map((plan) => {
      const estimatedPrice = calculateSimulationPrice(
        ageRange,
        dependents,
        plan as PlanPricing,
        pricingData.dependentFactor
      );

      const priceFormatted = estimatedPrice.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      });

      return {
        planId: plan.planId,
        planName: plan.planName,
        estimatedPrice,
        priceFormatted,
      };
    });
  }, [ageRange, dependents, pricingData]);

  const reset = () => {
    setAgeRange(null);
    setDependents(0);
  };

  return {
    ageRange,
    dependents,
    setAgeRange,
    setDependents,
    results,
    isCalculating: false,
    reset,
  };
}
