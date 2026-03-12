import React, { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { 
  Palette, 
  Type, 
  Layers, 
  Grid, 
  Copy, 
  Check,
  Search,
  Filter
} from 'lucide-react';

export function DesignTokens() {
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const copyToClipboard = (value: string, tokenName: string) => {
    navigator.clipboard.writeText(value);
    setCopiedToken(tokenName);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const colorTokens = [
    {
      category: "Primary Colors",
      tokens: [
        { name: "--color-primary", value: "#005B94", description: "Primary brand blue" },
        { name: "--color-primary-foreground", value: "#ffffff", description: "Text on primary background" },
        { name: "--color-primary-dark", value: "#003F66", description: "Dark primary for hover states" },
      ]
    },
    {
      category: "Background Colors",
      tokens: [
        { name: "--color-background", value: "#ffffff", description: "Main background color" },
        { name: "--color-secondary", value: "#f8f9fa", description: "Secondary background" },
        { name: "--color-muted", value: "#f8f9fa", description: "Muted background" },
        { name: "--color-card", value: "#ffffff", description: "Card background" },
      ]
    },
    {
      category: "Text Colors",
      tokens: [
        { name: "--color-foreground", value: "#374151", description: "Primary text color" },
        { name: "--color-muted-foreground", value: "#6b7280", description: "Secondary text color" },
        { name: "--color-card-foreground", value: "#374151", description: "Text on card background" },
      ]
    },
    {
      category: "Accent Colors",
      tokens: [
        { name: "--color-accent-green", value: "#28a745", description: "Success states, completed status" },
        { name: "--color-accent-orange", value: "#ffa500", description: "Warning states, pending actions" },
        { name: "--color-accent-teal", value: "#00b8c4", description: "Information states, secondary data" },
        { name: "--color-destructive", value: "#dc3545", description: "Error states, destructive actions" },
      ]
    },
    {
      category: "Border & UI Colors",
      tokens: [
        { name: "--color-border", value: "#e5e7eb", description: "Default border color" },
        { name: "--color-input", value: "#f8f9fa", description: "Input background" },
        { name: "--color-ring", value: "#005B94", description: "Focus ring color" },
      ]
    }
  ];

  const spacingTokens = [
    {
      category: "Base Spacing",
      tokens: [
        { name: "4px", value: "0.25rem", description: "Fine adjustments, icon gaps" },
        { name: "8px", value: "0.5rem", description: "Small spacing between related elements" },
        { name: "12px", value: "0.75rem", description: "Medium spacing, card internal elements" },
        { name: "16px", value: "1rem", description: "Standard spacing between components" },
        { name: "24px", value: "1.5rem", description: "Large spacing, section separation" },
        { name: "32px", value: "2rem", description: "Extra large spacing between major sections" },
      ]
    }
  ];

  const typographyTokens = [
    {
      category: "Font Weights",
      tokens: [
        { name: "--font-weight-normal", value: "400", description: "Regular text weight" },
        { name: "--font-weight-medium", value: "500", description: "Medium text weight" },
        { name: "--font-weight-semibold", value: "600", description: "Semibold text weight" },
        { name: "--font-weight-bold", value: "700", description: "Bold text weight" },
      ]
    },
    {
      category: "Font Sizes",
      tokens: [
        { name: "28px", value: "1.75rem", description: "Heading 1 - Page titles" },
        { name: "22px", value: "1.375rem", description: "Heading 2 - Section titles" },
        { name: "16px", value: "1rem", description: "Body text - Primary content" },
        { name: "14px", value: "0.875rem", description: "Muted text - Secondary information" },
        { name: "12px", value: "0.75rem", description: "Small text - Labels, badges" },
      ]
    }
  ];

  const shadowTokens = [
    {
      category: "Shadows",
      tokens: [
        { name: "--shadow-sm", value: "0 1px 2px 0 rgb(0 0 0 / 0.05)", description: "Small shadow" },
        { name: "--shadow", value: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)", description: "Default shadow" },
        { name: "--shadow-md", value: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)", description: "Medium shadow" },
      ]
    }
  ];

  const radiusTokens = [
    {
      category: "Border Radius",
      tokens: [
        { name: "--radius", value: "12px", description: "Default border radius" },
        { name: "--radius-sm", value: "10px", description: "Small border radius" },
        { name: "--radius-lg", value: "16px", description: "Large border radius" },
        { name: "--radius-xl", value: "20px", description: "Extra large border radius" },
      ]
    }
  ];

  const filteredTokens = (tokens: any[]) => {
    if (!searchTerm) return tokens;
    return tokens.filter(category => 
      category.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.tokens.some((token: any) => 
        token.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        token.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };

  const TokenCard = ({ name, value, description, tokenName }: any) => (
    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex-1">
        <div className="flex items-center gap-3">
          <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded" style={{ fontFamily: 'Monaco, Menlo, monospace' }}>
            {name}
          </code>
          <span className="text-body font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
            {value}
          </span>
        </div>
        <p className="text-muted mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
          {description}
        </p>
      </div>
      <Button
        size="sm"
        variant="outline"
        className="border-gray-300 text-foreground hover:bg-gray-50 font-medium text-sm px-3 py-1 rounded-md"
        style={{ fontFamily: 'Inter, sans-serif' }}
        onClick={() => copyToClipboard(value, tokenName)}
      >
        {copiedToken === tokenName ? (
          <Check className="h-3 w-3 text-green-600" />
        ) : (
          <Copy className="h-3 w-3" />
        )}
      </Button>
    </div>
  );

  const ColorSwatch = ({ color, name, value }: any) => (
    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex items-center gap-4">
        <div 
          className="w-12 h-12 rounded-lg border border-gray-200 shadow-sm"
          style={{ backgroundColor: value }}
        />
        <div>
          <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded" style={{ fontFamily: 'Monaco, Menlo, monospace' }}>
            {name}
          </code>
          <p className="text-muted mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
            {value}
          </p>
        </div>
      </div>
      <Button
        size="sm"
        variant="outline"
        className="border-gray-300 text-foreground hover:bg-gray-50 font-medium text-sm px-3 py-1 rounded-md"
        style={{ fontFamily: 'Inter, sans-serif' }}
        onClick={() => copyToClipboard(value, name)}
      >
        {copiedToken === name ? (
          <Check className="h-3 w-3 text-green-600" />
        ) : (
          <Copy className="h-3 w-3" />
        )}
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8F9FA' }}>
      {/* Header */}
      <div className="bg-primary text-primary-foreground px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-heading-1 font-bold mb-2" style={{ color: '#FFFFFF', fontFamily: 'Inter, sans-serif' }}>
                Design Tokens
              </h1>
              <p className="text-primary-foreground/90 text-base font-normal" style={{ fontFamily: 'Inter, sans-serif' }}>
                CSS variables and design tokens for the LiquidSpace design system
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 font-medium text-sm px-4 py-2 rounded-md"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy All
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="max-w-7xl mx-auto px-8 py-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search tokens..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-gray-300"
            style={{ fontFamily: 'Inter, sans-serif' }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-8 pb-8 space-y-12">
        {/* Color Tokens */}
        <div className="space-y-6">
          <div className="border-l-4 border-primary pl-6">
            <h2 className="text-heading-2 text-foreground font-semibold flex items-center gap-2" style={{ fontFamily: 'Inter, sans-serif' }}>
              <Palette className="h-5 w-5" />
              Color Tokens
            </h2>
            <p className="text-muted mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
              Brand colors and semantic color system
            </p>
          </div>

          {filteredTokens(colorTokens).map((category) => (
            <Card key={category.category} className="bg-white rounded-xl shadow-card border-0">
              <CardContent className="p-6">
                <h3 className="text-heading-2 text-foreground font-semibold mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {category.category}
                </h3>
                <div className="space-y-3">
                  {category.tokens.map((token) => (
                    <ColorSwatch
                      key={token.name}
                      name={token.name}
                      value={token.value}
                      description={token.description}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Typography Tokens */}
        <div className="space-y-6">
          <div className="border-l-4 border-primary pl-6">
            <h2 className="text-heading-2 text-foreground font-semibold flex items-center gap-2" style={{ fontFamily: 'Inter, sans-serif' }}>
              <Type className="h-5 w-5" />
              Typography Tokens
            </h2>
            <p className="text-muted mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
              Font weights, sizes, and typography scale
            </p>
          </div>

          {filteredTokens(typographyTokens).map((category) => (
            <Card key={category.category} className="bg-white rounded-xl shadow-card border-0">
              <CardContent className="p-6">
                <h3 className="text-heading-2 text-foreground font-semibold mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {category.category}
                </h3>
                <div className="space-y-3">
                  {category.tokens.map((token) => (
                    <TokenCard
                      key={token.name}
                      name={token.name}
                      value={token.value}
                      description={token.description}
                      tokenName={token.name}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Spacing Tokens */}
        <div className="space-y-6">
          <div className="border-l-4 border-primary pl-6">
            <h2 className="text-heading-2 text-foreground font-semibold flex items-center gap-2" style={{ fontFamily: 'Inter, sans-serif' }}>
              <Grid className="h-5 w-5" />
              Spacing Tokens
            </h2>
            <p className="text-muted mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
              8px grid system for consistent spacing
            </p>
          </div>

          {filteredTokens(spacingTokens).map((category) => (
            <Card key={category.category} className="bg-white rounded-xl shadow-card border-0">
              <CardContent className="p-6">
                <h3 className="text-heading-2 text-foreground font-semibold mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {category.category}
                </h3>
                <div className="space-y-3">
                  {category.tokens.map((token) => (
                    <TokenCard
                      key={token.name}
                      name={token.name}
                      value={token.value}
                      description={token.description}
                      tokenName={token.name}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Shadow & Radius Tokens */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Shadows */}
          <div className="space-y-6">
            <div className="border-l-4 border-primary pl-6">
              <h2 className="text-heading-2 text-foreground font-semibold flex items-center gap-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                <Layers className="h-5 w-5" />
                Shadow Tokens
              </h2>
            </div>

            {filteredTokens(shadowTokens).map((category) => (
              <Card key={category.category} className="bg-white rounded-xl shadow-card border-0">
                <CardContent className="p-6">
                  <h3 className="text-heading-2 text-foreground font-semibold mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {category.category}
                  </h3>
                  <div className="space-y-3">
                    {category.tokens.map((token) => (
                      <TokenCard
                        key={token.name}
                        name={token.name}
                        value={token.value}
                        description={token.description}
                        tokenName={token.name}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Border Radius */}
          <div className="space-y-6">
            <div className="border-l-4 border-primary pl-6">
              <h2 className="text-heading-2 text-foreground font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
                Border Radius
              </h2>
            </div>

            {filteredTokens(radiusTokens).map((category) => (
              <Card key={category.category} className="bg-white rounded-xl shadow-card border-0">
                <CardContent className="p-6">
                  <h3 className="text-heading-2 text-foreground font-semibold mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {category.category}
                  </h3>
                  <div className="space-y-3">
                    {category.tokens.map((token) => (
                      <TokenCard
                        key={token.name}
                        name={token.name}
                        value={token.value}
                        description={token.description}
                        tokenName={token.name}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Implementation Guide */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <Card className="bg-white rounded-xl shadow-card border-0">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <Copy className="h-6 w-6 text-primary" />
                <h3 className="text-heading-2 text-foreground font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Implementation Guide
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="text-body font-semibold text-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>
                    CSS Variables Usage
                  </h4>
                  <div className="bg-gray-900 rounded-lg p-4">
                    <pre className="text-sm text-gray-100" style={{ fontFamily: 'Monaco, Menlo, monospace' }}>
{`/* Using design tokens */
.button-primary {
  background-color: var(--color-primary);
  color: var(--color-primary-foreground);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
}`}
                    </pre>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-body font-semibold text-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Tailwind Classes
                  </h4>
                  <div className="bg-gray-900 rounded-lg p-4">
                    <pre className="text-sm text-gray-100" style={{ fontFamily: 'Monaco, Menlo, monospace' }}>
{`<!-- Using Tailwind utilities -->
<button class="bg-primary text-primary-foreground 
               rounded-md shadow">
  Primary Button
</button>`}
                    </pre>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start gap-3">
                  <Palette className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-sm font-semibold text-blue-800 mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                      Consistency Note
                    </h5>
                    <p className="text-sm text-blue-700" style={{ fontFamily: 'Inter, sans-serif' }}>
                      Always use design tokens instead of hardcoded values. This ensures consistency across the application and makes theme changes easier to implement.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}