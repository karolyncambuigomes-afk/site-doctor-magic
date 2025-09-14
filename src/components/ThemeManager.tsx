import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { RotateCcw, Palette, Download, Upload } from 'lucide-react';

interface ColorVariable {
  name: string;
  value: string;
  description: string;
  category: 'background' | 'text' | 'primary' | 'secondary' | 'accent' | 'destructive' | 'border' | 'luxury';
}

const defaultColors: ColorVariable[] = [
  // Background & Text
  { name: '--background', value: '0 0% 100%', description: 'Cor de fundo principal', category: 'background' },
  { name: '--foreground', value: '222 84% 5%', description: 'Cor do texto principal', category: 'text' },
  { name: '--card', value: '0 0% 100%', description: 'Cor de fundo dos cards', category: 'background' },
  { name: '--card-foreground', value: '222 84% 5%', description: 'Cor do texto dos cards', category: 'text' },
  { name: '--popover', value: '0 0% 100%', description: 'Cor de fundo dos popovers', category: 'background' },
  { name: '--popover-foreground', value: '222 84% 5%', description: 'Cor do texto dos popovers', category: 'text' },
  
  // Primary Colors
  { name: '--primary', value: '222 47% 11%', description: 'Cor primária', category: 'primary' },
  { name: '--primary-foreground', value: '210 40% 98%', description: 'Texto sobre cor primária', category: 'primary' },
  
  // Secondary Colors
  { name: '--secondary', value: '210 40% 96%', description: 'Cor secundária', category: 'secondary' },
  { name: '--secondary-foreground', value: '222 84% 5%', description: 'Texto sobre cor secundária', category: 'secondary' },
  
  // Accent Colors
  { name: '--accent', value: '210 40% 96%', description: 'Cor de destaque', category: 'accent' },
  { name: '--accent-foreground', value: '222 84% 5%', description: 'Texto sobre cor de destaque', category: 'accent' },
  { name: '--muted', value: '210 40% 96%', description: 'Cor neutra', category: 'accent' },
  { name: '--muted-foreground', value: '215 16% 47%', description: 'Texto neutro', category: 'accent' },
  
  // Destructive
  { name: '--destructive', value: '0 84% 60%', description: 'Cor de erro/perigo', category: 'destructive' },
  { name: '--destructive-foreground', value: '210 40% 98%', description: 'Texto sobre cor de erro', category: 'destructive' },
  
  // Borders & Inputs
  { name: '--border', value: '214 32% 91%', description: 'Cor das bordas', category: 'border' },
  { name: '--input', value: '214 32% 91%', description: 'Cor dos inputs', category: 'border' },
  { name: '--ring', value: '222 84% 5%', description: 'Cor do foco', category: 'border' },
  
  // Luxury Colors
  { name: '--luxury-navy', value: '220 39% 11%', description: 'Azul marinho luxo', category: 'luxury' },
  { name: '--luxury-gold', value: '45 93% 58%', description: 'Dourado luxo', category: 'luxury' },
  { name: '--luxury-cream', value: '60 9% 98%', description: 'Creme luxo', category: 'luxury' },
];

const darkModeColors: ColorVariable[] = [
  { name: '--background', value: '222 84% 5%', description: 'Cor de fundo principal (dark)', category: 'background' },
  { name: '--foreground', value: '210 40% 98%', description: 'Cor do texto principal (dark)', category: 'text' },
  { name: '--card', value: '222 84% 5%', description: 'Cor de fundo dos cards (dark)', category: 'background' },
  { name: '--card-foreground', value: '210 40% 98%', description: 'Cor do texto dos cards (dark)', category: 'text' },
  { name: '--popover', value: '222 84% 5%', description: 'Cor de fundo dos popovers (dark)', category: 'background' },
  { name: '--popover-foreground', value: '210 40% 98%', description: 'Cor do texto dos popovers (dark)', category: 'text' },
  { name: '--primary', value: '210 40% 98%', description: 'Cor primária (dark)', category: 'primary' },
  { name: '--primary-foreground', value: '222 47% 11%', description: 'Texto sobre cor primária (dark)', category: 'primary' },
  { name: '--secondary', value: '217 33% 17%', description: 'Cor secundária (dark)', category: 'secondary' },
  { name: '--secondary-foreground', value: '210 40% 98%', description: 'Texto sobre cor secundária (dark)', category: 'secondary' },
  { name: '--accent', value: '217 33% 17%', description: 'Cor de destaque (dark)', category: 'accent' },
  { name: '--accent-foreground', value: '210 40% 98%', description: 'Texto sobre cor de destaque (dark)', category: 'accent' },
  { name: '--muted', value: '217 33% 17%', description: 'Cor neutra (dark)', category: 'accent' },
  { name: '--muted-foreground', value: '215 20% 65%', description: 'Texto neutro (dark)', category: 'accent' },
  { name: '--destructive', value: '0 63% 31%', description: 'Cor de erro/perigo (dark)', category: 'destructive' },
  { name: '--destructive-foreground', value: '210 40% 98%', description: 'Texto sobre cor de erro (dark)', category: 'destructive' },
  { name: '--border', value: '217 33% 17%', description: 'Cor das bordas (dark)', category: 'border' },
  { name: '--input', value: '217 33% 17%', description: 'Cor dos inputs (dark)', category: 'border' },
  { name: '--ring', value: '212 95% 68%', description: 'Cor do foco (dark)', category: 'border' },
  { name: '--luxury-navy', value: '220 39% 11%', description: 'Azul marinho luxo (dark)', category: 'luxury' },
  { name: '--luxury-gold', value: '45 93% 58%', description: 'Dourado luxo (dark)', category: 'luxury' },
  { name: '--luxury-cream', value: '60 9% 98%', description: 'Creme luxo (dark)', category: 'luxury' },
];

export const ThemeManager: React.FC = () => {
  const { toast } = useToast();
  const [lightColors, setLightColors] = useState<ColorVariable[]>(defaultColors);
  const [darkColors, setDarkColors] = useState<ColorVariable[]>(darkModeColors);
  const [activeMode, setActiveMode] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Load current colors from CSS variables
    loadCurrentColors();
  }, []);

  const loadCurrentColors = () => {
    const root = document.documentElement;
    const newLightColors = [...lightColors];
    
    lightColors.forEach((color, index) => {
      const currentValue = getComputedStyle(root).getPropertyValue(color.name).trim();
      if (currentValue) {
        newLightColors[index] = { ...color, value: currentValue };
      }
    });
    
    setLightColors(newLightColors);
  };

  const updateColor = (colorName: string, newValue: string, mode: 'light' | 'dark') => {
    if (mode === 'light') {
      setLightColors(prev => 
        prev.map(color => 
          color.name === colorName ? { ...color, value: newValue } : color
        )
      );
    } else {
      setDarkColors(prev => 
        prev.map(color => 
          color.name === colorName ? { ...color, value: newValue } : color
        )
      );
    }
  };

  const applyColors = () => {
    const root = document.documentElement;
    
    // Apply light mode colors
    lightColors.forEach(color => {
      root.style.setProperty(color.name, color.value);
    });

    // Apply dark mode colors to .dark class
    const styleId = 'dynamic-dark-theme';
    let styleElement = document.getElementById(styleId) as HTMLStyleElement;
    
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }

    const darkCSS = darkColors.map(color => 
      `${color.name}: ${color.value};`
    ).join('\n    ');

    styleElement.textContent = `.dark {\n    ${darkCSS}\n  }`;

    toast({
      title: "Tema Aplicado",
      description: "As cores foram aplicadas com sucesso!",
    });
  };

  const resetToDefault = () => {
    setLightColors(defaultColors);
    setDarkColors(darkModeColors);
    
    toast({
      title: "Tema Resetado",
      description: "Cores resetadas para o padrão",
    });
  };

  const exportTheme = () => {
    const themeData = {
      light: lightColors,
      dark: darkColors,
      exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(themeData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'theme-colors.json';
    link.click();
    
    URL.revokeObjectURL(url);
    
    toast({
      title: "Tema Exportado",
      description: "Arquivo de tema baixado com sucesso!",
    });
  };

  const importTheme = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const themeData = JSON.parse(e.target?.result as string);
        if (themeData.light && themeData.dark) {
          setLightColors(themeData.light);
          setDarkColors(themeData.dark);
          toast({
            title: "Tema Importado",
            description: "Tema carregado com sucesso!",
          });
        }
      } catch (error) {
        toast({
          title: "Erro",
          description: "Arquivo de tema inválido",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
  };

  const renderColorInputs = (colors: ColorVariable[], mode: 'light' | 'dark') => {
    const categories = ['background', 'text', 'primary', 'secondary', 'accent', 'destructive', 'border', 'luxury'] as const;
    
    return categories.map(category => {
      const categoryColors = colors.filter(color => color.category === category);
      if (categoryColors.length === 0) return null;

      return (
        <Card key={category} className="mb-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg capitalize">{category}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {categoryColors.map(color => (
              <div key={color.name} className="space-y-2">
                <Label htmlFor={`${mode}-${color.name}`} className="text-sm font-medium">
                  {color.name}
                  <Badge variant="outline" className="ml-2 text-xs">{color.description}</Badge>
                </Label>
                <div className="flex gap-2">
                  <Input
                    id={`${mode}-${color.name}`}
                    value={color.value}
                    onChange={(e) => updateColor(color.name, e.target.value, mode)}
                    placeholder="h s% l% (ex: 222 47% 11%)"
                    className="font-mono text-sm"
                  />
                  <div 
                    className="w-10 h-10 rounded border-2 border-gray-300 shrink-0"
                    style={{ backgroundColor: `hsl(${color.value})` }}
                    title={`Preview: hsl(${color.value})`}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      );
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Gerenciador de Tema
              </CardTitle>
              <CardDescription>
                Configure as cores do tema do sistema. Use valores HSL (matiz saturação luminosidade).
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={resetToDefault} size="sm">
                <RotateCcw className="w-4 h-4 mr-2" />
                Resetar
              </Button>
              <Button variant="outline" onClick={exportTheme} size="sm">
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
              <Button variant="outline" size="sm" asChild>
                <label htmlFor="import-theme" className="cursor-pointer">
                  <Upload className="w-4 h-4 mr-2" />
                  Importar
                </label>
              </Button>
              <input
                id="import-theme"
                type="file"
                accept=".json"
                onChange={importTheme}
                className="hidden"
              />
              <Button onClick={applyColors}>
                Aplicar Cores
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs value={activeMode} onValueChange={(value) => setActiveMode(value as 'light' | 'dark')}>
        <TabsList>
          <TabsTrigger value="light">Modo Claro</TabsTrigger>
          <TabsTrigger value="dark">Modo Escuro</TabsTrigger>
        </TabsList>

        <TabsContent value="light" className="space-y-4">
          <div className="text-sm text-muted-foreground mb-4">
            Configure as cores para o modo claro. Use o formato HSL sem parênteses (ex: 222 47% 11%).
          </div>
          {renderColorInputs(lightColors, 'light')}
        </TabsContent>

        <TabsContent value="dark" className="space-y-4">
          <div className="text-sm text-muted-foreground mb-4">
            Configure as cores para o modo escuro. Use o formato HSL sem parênteses (ex: 222 47% 11%).
          </div>
          {renderColorInputs(darkColors, 'dark')}
        </TabsContent>
      </Tabs>
    </div>
  );
};