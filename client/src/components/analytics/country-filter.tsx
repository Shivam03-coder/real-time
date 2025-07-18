"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { CountryFilter } from "@/types/analytics";
import { Filter, X } from "lucide-react";

interface CountryFilterProps {
  countries: CountryFilter[];
  selectedCountry?: string;
  onCountrySelect: (country: string) => void;
  onClearFilter: () => void;
}

export function CountryFilterComponent({ 
  countries, 
  selectedCountry, 
  onCountrySelect, 
  onClearFilter 
}: CountryFilterProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filter by Country
          </CardTitle>
          {selectedCountry && (
            <Button variant="ghost" size="sm" onClick={onClearFilter}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {countries.map((country) => (
            <Button
              key={country.country}
              variant={selectedCountry === country.country ? "default" : "ghost"}
              className="w-full justify-between"
              onClick={() => onCountrySelect(country.country)}
            >
              <span>{country.country}</span>
              <Badge variant="secondary">{country.count}</Badge>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}