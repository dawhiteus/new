import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { AlternativeSpacesModal } from './AlternativeSpacesModal';
import { sampleSpaces } from './data/sample-spaces';

export function CollectionsModalTest() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewFullCollection = () => {
    console.log('View Full Collection clicked');
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-secondary p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 
            className="text-heading-1 mb-2"
            style={{
              fontSize: '28px',
              fontWeight: 700,
              color: '#374151',
              fontFamily: 'Inter, sans-serif'
            }}
          >
            Collections Modal Test
          </h1>
          <p 
            className="text-muted"
            style={{
              fontSize: '14px',
              color: '#6B7280',
              fontFamily: 'Inter, sans-serif'
            }}
          >
            Test the alternative spaces collection modal functionality
          </p>
        </div>

        {/* Test Controls */}
        <Card className="bg-white rounded-xl shadow-card border-0 mb-8">
          <CardHeader className="pb-4">
            <CardTitle 
              className="text-heading-2"
              style={{
                fontSize: '22px',
                fontWeight: 600,
                color: '#374151',
                fontFamily: 'Inter, sans-serif'
              }}
            >
              Modal Test Controls
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Button
                onClick={() => setIsModalOpen(true)}
                className="bg-primary hover:bg-primary-dark text-primary-foreground font-medium px-6 py-2"
                style={{
                  backgroundColor: '#005B94',
                  fontSize: '14px',
                  fontWeight: 500,
                  fontFamily: 'Inter, sans-serif'
                }}
              >
                Open Collections Modal
              </Button>
              <span 
                className="text-muted"
                style={{
                  fontSize: '14px',
                  color: '#6B7280',
                  fontFamily: 'Inter, sans-serif'
                }}
              >
                Click to test the alternative spaces modal with {sampleSpaces.length} sample workspaces
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Sample Data Preview */}
        <Card className="bg-white rounded-xl shadow-card border-0">
          <CardHeader className="pb-4">
            <CardTitle 
              className="text-heading-2"
              style={{
                fontSize: '22px',
                fontWeight: 600,
                color: '#374151',
                fontFamily: 'Inter, sans-serif'
              }}
            >
              Sample Data Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sampleSpaces.slice(0, 3).map((space) => (
                <div key={space.id} className="p-4 border border-border rounded-lg">
                  <h4 
                    className="font-medium mb-2"
                    style={{
                      fontSize: '15px',
                      fontWeight: 500,
                      color: '#374151',
                      fontFamily: 'Inter, sans-serif'
                    }}
                  >
                    {space.name}
                  </h4>
                  <p 
                    className="text-muted text-sm mb-1"
                    style={{
                      fontSize: '13px',
                      color: '#6B7280',
                      fontFamily: 'Inter, sans-serif'
                    }}
                  >
                    {space.location}
                  </p>
                  <p 
                    className="font-bold"
                    style={{
                      fontSize: '16px',
                      fontWeight: 700,
                      color: '#374151',
                      fontFamily: 'Inter, sans-serif'
                    }}
                  >
                    ${space.price.toLocaleString()}/{space.priceUnit}
                  </p>
                </div>
              ))}
            </div>
            <p 
              className="text-muted mt-4"
              style={{
                fontSize: '14px',
                color: '#6B7280',
                fontFamily: 'Inter, sans-serif'
              }}
            >
              And {sampleSpaces.length - 3} more spaces in the full collection...
            </p>
          </CardContent>
        </Card>

        {/* Collections Modal */}
        <AlternativeSpacesModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          licenseName="San Francisco Office License"
          spaces={sampleSpaces}
          onViewFullCollection={handleViewFullCollection}
        />
      </div>
    </div>
  );
}