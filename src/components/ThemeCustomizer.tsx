import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Palette, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";

interface ThemeCustomizerProps {
  onThemeChange?: (theme: any) => void;
}

const colorPalettes = [
  {
    name: 'Default Blue',
    primary: '#3b82f6',
    secondary: '#64748b',
    accent: '#f59e0b',
    background: '#ffffff',
    foreground: '#0f172a'
  },
  {
    name: 'Ocean Breeze',
    primary: '#0ea5e9',
    secondary: '#06b6d4',
    accent: '#84cc16',
    background: '#f0f9ff',
    foreground: '#0c4a6e'
  },
  {
    name: 'Sunset Orange',
    primary: '#f97316',
    secondary: '#f59e0b',
    accent: '#ef4444',
    background: '#fff7ed',
    foreground: '#9a3412'
  },
  {
    name: 'Forest Green',
    primary: '#059669',
    secondary: '#10b981',
    accent: '#84cc16',
    background: '#f0fdf4',
    foreground: '#064e3b'
  },
  {
    name: 'Royal Purple',
    primary: '#7c3aed',
    secondary: '#a855f7',
    accent: '#ec4899',
    background: '#faf5ff',
    foreground: '#581c87'
  }
];

export const ThemeCustomizer = ({ onThemeChange }: ThemeCustomizerProps) => {
  const { theme, setTheme } = useTheme();
  const [selectedPalette, setSelectedPalette] = useState(colorPalettes[0]);
  const [customTheme, setCustomTheme] = useState({
    darkMode: false,
    palette: colorPalettes[0],
    chartStyle: 'modern'
  });

  useEffect(() => {
    setCustomTheme(prev => ({
      ...prev,
      darkMode: theme === 'dark'
    }));
  }, [theme]);

  const handlePaletteChange = (paletteName: string) => {
    const palette = colorPalettes.find(p => p.name === paletteName) || colorPalettes[0];
    setSelectedPalette(palette);
    
    const newTheme = {
      ...customTheme,
      palette
    };
    setCustomTheme(newTheme);
    
    // Apply CSS custom properties
    const root = document.documentElement;
    root.style.setProperty('--theme-primary', palette.primary);
    root.style.setProperty('--theme-secondary', palette.secondary);
    root.style.setProperty('--theme-accent', palette.accent);
    
    onThemeChange?.(newTheme);
  };

  const handleDarkModeToggle = (checked: boolean) => {
    setTheme(checked ? 'dark' : 'light');
    const newTheme = {
      ...customTheme,
      darkMode: checked
    };
    setCustomTheme(newTheme);
    onThemeChange?.(newTheme);
  };

  const handleChartStyleChange = (style: string) => {
    const newTheme = {
      ...customTheme,
      chartStyle: style
    };
    setCustomTheme(newTheme);
    onThemeChange?.(newTheme);
  };

  const resetToDefault = () => {
    const defaultTheme = {
      darkMode: false,
      palette: colorPalettes[0],
      chartStyle: 'modern'
    };
    
    setCustomTheme(defaultTheme);
    setSelectedPalette(colorPalettes[0]);
    setTheme('light');
    
    // Reset CSS properties
    const root = document.documentElement;
    root.style.removeProperty('--theme-primary');
    root.style.removeProperty('--theme-secondary');
    root.style.removeProperty('--theme-accent');
    
    onThemeChange?.(defaultTheme);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Theme Customizer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Dark Mode Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {customTheme.darkMode ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
            <Label htmlFor="dark-mode">Dark Mode</Label>
          </div>
          <Switch
            id="dark-mode"
            checked={customTheme.darkMode}
            onCheckedChange={handleDarkModeToggle}
          />
        </div>

        {/* Color Palette Selection */}
        <div className="space-y-3">
          <Label>Color Palette</Label>
          <Select value={selectedPalette.name} onValueChange={handlePaletteChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {colorPalettes.map(palette => (
                <SelectItem key={palette.name} value={palette.name}>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <div 
                        className="w-3 h-3 rounded-full border" 
                        style={{ backgroundColor: palette.primary }}
                      />
                      <div 
                        className="w-3 h-3 rounded-full border" 
                        style={{ backgroundColor: palette.secondary }}
                      />
                      <div 
                        className="w-3 h-3 rounded-full border" 
                        style={{ backgroundColor: palette.accent }}
                      />
                    </div>
                    {palette.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Chart Style */}
        <div className="space-y-3">
          <Label>Chart Style</Label>
          <Select value={customTheme.chartStyle} onValueChange={handleChartStyleChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="modern">Modern</SelectItem>
              <SelectItem value="classic">Classic</SelectItem>
              <SelectItem value="minimal">Minimal</SelectItem>
              <SelectItem value="vibrant">Vibrant</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Color Preview */}
        <div className="space-y-3">
          <Label>Color Preview</Label>
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center">
              <div 
                className="w-full h-12 rounded border mb-1"
                style={{ backgroundColor: selectedPalette.primary }}
              />
              <Label className="text-xs">Primary</Label>
            </div>
            <div className="text-center">
              <div 
                className="w-full h-12 rounded border mb-1"
                style={{ backgroundColor: selectedPalette.secondary }}
              />
              <Label className="text-xs">Secondary</Label>
            </div>
            <div className="text-center">
              <div 
                className="w-full h-12 rounded border mb-1"
                style={{ backgroundColor: selectedPalette.accent }}
              />
              <Label className="text-xs">Accent</Label>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button onClick={resetToDefault} variant="outline" className="flex-1">
            Reset to Default
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};