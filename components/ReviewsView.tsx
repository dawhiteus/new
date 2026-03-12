import React from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Star, Search, Filter, Download, MapPin, Clock, ThumbsUp, ThumbsDown } from 'lucide-react';

export function ReviewsView() {
  const reviews = [
    {
      id: 1,
      user: 'Patrick Henkel',
      location: 'AT&T Hub @ San Ramon',
      rating: 5,
      title: 'Excellent workspace with great amenities',
      comment: 'The space was clean, well-equipped, and the staff was very helpful. WiFi was fast and reliable.',
      date: '2025-08-15',
      helpful: 12,
      verified: true,
    },
    {
      id: 2,
      user: 'Amy Johnson',
      location: 'Serendipity Labs - Dublin',
      rating: 4,
      title: 'Good location but could improve lighting',
      comment: 'Overall a solid workspace. Location is convenient but the lighting in some areas could be better.',
      date: '2025-08-14',
      helpful: 8,
      verified: true,
    },
    {
      id: 3,
      user: 'Kelly Sandmann',
      location: 'CENTRL Office - South Bay',
      rating: 3,
      title: 'Average experience',
      comment: 'The space was okay but felt a bit crowded during peak hours. Meeting rooms were well-equipped though.',
      date: '2025-08-13',
      helpful: 5,
      verified: false,
    },
    {
      id: 4,
      user: 'Amanda Barker',
      location: 'SynerQ Coworking',
      rating: 5,
      title: 'Perfect for team collaboration',
      comment: 'Amazing space for our team retreat. Great meeting rooms and collaborative areas.',
      date: '2025-08-12',
      helpful: 15,
      verified: true,
    },
  ];

  const ratingDistribution = [
    { rating: 5, count: 487, percentage: 68 },
    { rating: 4, count: 156, percentage: 22 },
    { rating: 3, count: 45, percentage: 6 },
    { rating: 2, count: 18, percentage: 3 },
    { rating: 1, count: 8, percentage: 1 },
  ];

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground mb-2">Reviews</h1>
        <p className="text-sm text-muted-foreground">
          Monitor and analyze user feedback across all workspace locations
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-6">
        <Card className="bg-white border border-border rounded-lg shadow-card">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                  Average Rating
                </div>
                <div className="text-3xl font-semibold text-foreground mb-1">
                  4.1
                </div>
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                  Out of 5 stars
                </div>
              </div>
              <Star className="h-5 w-5 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-border rounded-lg shadow-card">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                  Total Reviews
                </div>
                <div className="text-3xl font-semibold text-foreground mb-1">
                  714
                </div>
                <div className="text-xs text-muted-foreground">
                  +45 this month
                </div>
              </div>
              <ThumbsUp className="h-5 w-5 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-border rounded-lg shadow-card">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                  Response Rate
                </div>
                <div className="text-3xl font-semibold text-foreground mb-1">
                  87%
                </div>
                <div className="text-xs text-muted-foreground">
                  Users who review
                </div>
              </div>
              <ThumbsUp className="h-5 w-5 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-border rounded-lg shadow-card">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                  Satisfaction
                </div>
                <div className="text-3xl font-semibold text-foreground mb-1">
                  90%
                </div>
                <div className="text-xs text-muted-foreground">
                  4+ star ratings
                </div>
              </div>
              <ThumbsUp className="h-5 w-5 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Rating Distribution */}
        <Card className="bg-white border border-border rounded-lg shadow-card">
          <div className="p-5 border-b border-border">
            <h3 className="text-lg font-medium text-foreground">Rating Distribution</h3>
          </div>
          <CardContent className="p-5">
            <div className="space-y-3">
              {ratingDistribution.map((item) => (
                <div key={item.rating} className="flex items-center gap-3">
                  <div className="flex items-center gap-1 min-w-[60px]">
                    <span className="text-sm font-medium">{item.rating}</span>
                    <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                  </div>
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                  <div className="text-sm text-muted-foreground min-w-[40px] text-right">
                    {item.count}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Reviews - spans 2 columns */}
        <Card className="lg:col-span-2 bg-white border border-border rounded-lg shadow-card">
          <div className="p-5 border-b border-border">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-foreground">Recent Reviews</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="bg-white border border-border hover:bg-muted rounded-lg font-medium">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline" size="sm" className="bg-white border border-border hover:bg-muted rounded-lg font-medium">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </div>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {reviews.map((review) => (
                <div key={review.id} className="p-5 hover:bg-muted/30 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="text-sm font-medium text-foreground">
                        {review.user}
                      </div>
                      {review.verified && (
                        <Badge className="text-xs bg-green-50 text-green-700 hover:bg-green-50">
                          Verified
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {renderStars(review.rating)}
                      <span className="text-xs text-muted-foreground">
                        {review.date}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {review.location}
                    </span>
                  </div>
                  
                  <div className="mb-3">
                    <h4 className="text-sm font-medium text-foreground mb-1">
                      {review.title}
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {review.comment}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" className="h-7 px-2 text-xs hover:bg-muted">
                        <ThumbsUp className="h-3 w-3 mr-1" />
                        Helpful ({review.helpful})
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 px-2 text-xs hover:bg-muted">
                        Reply
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}