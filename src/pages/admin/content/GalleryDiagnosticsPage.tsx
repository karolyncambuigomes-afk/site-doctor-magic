import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GalleryDiagnostics } from '@/components/GalleryDiagnostics';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const GalleryDiagnosticsPage: React.FC = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Gallery System Diagnostics</h1>
          <p className="text-muted-foreground">
            Manage and diagnose gallery images, conversions, and optimization status.
          </p>
        </div>

        <Tabs defaultValue="diagnostics" className="w-full">
          <TabsList className="grid w-full grid-cols-1">
            <TabsTrigger value="diagnostics">Gallery Diagnostics & Fix</TabsTrigger>
          </TabsList>

          <TabsContent value="diagnostics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Gallery System Overview</CardTitle>
                <CardDescription>
                  This system manages gallery images using two arrays in the models table:
                  <br />• <strong>gallery_external_urls</strong>: Original source URLs
                  <br />• <strong>gallery_local_urls</strong>: Optimized local proxy URLs
                  <br />The system prioritizes local URLs and falls back to external URLs.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <GalleryDiagnostics />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};