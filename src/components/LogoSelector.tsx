import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";

interface LogoOption {
  id: string;
  name: string;
  description: string;
  file: string;
}

const logoOptions: LogoOption[] = [
  {
    id: "current",
    name: "Current (YouTube Icon)",
    description: "Simple YouTube play button with gradient background",
    file: "current"
  },
  {
    id: "option1",
    name: "Gradient Circle",
    description: "Play button in gradient circle with jump arrow",
    file: "logo-option-1.svg"
  },
  {
    id: "option2", 
    name: "Hexagon Design",
    description: "Modern hexagon with YouTube play and jump lines",
    file: "logo-option-2.svg"
  },
  {
    id: "option3",
    name: "Rounded Square",
    description: "Clean rounded square with sparkle jump arrow",
    file: "logo-option-3.svg"
  },
  {
    id: "option4",
    name: "Diamond Shape",
    description: "Diamond background with lightning bolt jump",
    file: "logo-option-4.svg"
  },
  {
    id: "text",
    name: "Text Logo",
    description: "Icon + text combination",
    file: "logo-text.svg"
  }
];

interface LogoSelectorProps {
  onLogoChange: (logoId: string) => void;
  currentLogo: string;
}

export const LogoSelector = ({ onLogoChange, currentLogo }: LogoSelectorProps) => {
  const [selectedLogo, setSelectedLogo] = useState(currentLogo);

  const handleLogoSelect = (logoId: string) => {
    setSelectedLogo(logoId);
    onLogoChange(logoId);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Choose Your Logo</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {logoOptions.map((option) => (
          <Card 
            key={option.id}
            className={`p-4 cursor-pointer transition-all duration-200 ${
              selectedLogo === option.id 
                ? 'ring-2 ring-primary bg-primary/5' 
                : 'hover:bg-muted/50'
            }`}
            onClick={() => handleLogoSelect(option.id)}
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                {option.id === "current" ? (
                  <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                    <div className="w-4 h-4 bg-white rounded-sm"></div>
                  </div>
                ) : (
                  <img 
                    src={`/${option.file}`} 
                    alt={option.name}
                    className="w-8 h-8 object-contain"
                  />
                )}
              </div>
              <div className="flex-1">
                <h4 className="font-medium">{option.name}</h4>
                <p className="text-sm text-muted-foreground">{option.description}</p>
              </div>
              {selectedLogo === option.id && (
                <Check className="h-5 w-5 text-primary" />
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
