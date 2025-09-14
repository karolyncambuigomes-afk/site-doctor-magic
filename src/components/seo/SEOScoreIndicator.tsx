import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, AlertCircle, XCircle, Target } from 'lucide-react';

interface SEOCriteria {
  name: string;
  status: 'good' | 'warning' | 'error';
  description: string;
  score: number;
}

interface SEOScoreIndicatorProps {
  title?: string;
  description?: string;
  keywords?: string[];
  content?: string;
  url?: string;
}

export const SEOScoreIndicator: React.FC<SEOScoreIndicatorProps> = ({
  title = '',
  description = '',
  keywords = [],
  content = '',
  url = ''
}) => {
  const criteria: SEOCriteria[] = [
    {
      name: 'Title Length',
      status: title.length >= 30 && title.length <= 60 ? 'good' : 'warning',
      description: `${title.length} characters (recommended: 30-60)`,
      score: title.length >= 30 && title.length <= 60 ? 100 : title.length > 0 ? 50 : 0
    },
    {
      name: 'Meta Description',
      status: description.length >= 120 && description.length <= 160 ? 'good' : 'warning',
      description: `${description.length} characters (recommended: 120-160)`,
      score: description.length >= 120 && description.length <= 160 ? 100 : description.length > 0 ? 50 : 0
    },
    {
      name: 'Keywords',
      status: keywords.length >= 3 && keywords.length <= 10 ? 'good' : 'warning',
      description: `${keywords.length} keywords (recommended: 3-10)`,
      score: keywords.length >= 3 && keywords.length <= 10 ? 100 : keywords.length > 0 ? 50 : 0
    },
    {
      name: 'Content Length',
      status: content.length >= 300 ? 'good' : 'warning',
      description: `${content.length} characters (recommended: 300+)`,
      score: content.length >= 300 ? 100 : content.length > 0 ? 50 : 0
    },
    {
      name: 'URL Structure',
      status: url.length > 0 && url.includes('-') && !url.includes('_') ? 'good' : 'warning',
      description: url.length > 0 ? 'URL structure looks good' : 'No URL provided',
      score: url.length > 0 && url.includes('-') && !url.includes('_') ? 100 : 50
    }
  ];

  const totalScore = Math.round(criteria.reduce((sum, criterion) => sum + criterion.score, 0) / criteria.length);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const getStatusIcon = (status: 'good' | 'warning' | 'error') => {
    switch (status) {
      case 'good':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            SEO Score
          </span>
          <Badge className={`${getScoreBgColor(totalScore)} ${getScoreColor(totalScore)} text-sm font-bold`}>
            {totalScore}/100
          </Badge>
        </CardTitle>
        <CardDescription>
          Real-time SEO optimization analysis
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Overall Score</span>
            <span className={`font-medium ${getScoreColor(totalScore)}`}>
              {totalScore}%
            </span>
          </div>
          <Progress value={totalScore} className="h-2" />
        </div>

        <div className="space-y-3">
          {criteria.map((criterion, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                {getStatusIcon(criterion.status)}
                <span className="font-medium">{criterion.name}</span>
              </div>
              <div className="text-right">
                <div className="text-muted-foreground text-xs">
                  {criterion.description}
                </div>
                <div className={`font-medium ${getScoreColor(criterion.score)}`}>
                  {criterion.score}/100
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};