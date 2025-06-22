
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ModerationTabs from './moderation/ModerationTabs';
import POIFormComponent from './form/POIFormComponent';

const AdminPanel: React.FC = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">🏛️ Panel di Moderazione POI</h1>
      
      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending">Proposte da Moderare</TabsTrigger>
          <TabsTrigger value="approved">Esperienze Approvate</TabsTrigger>
          <TabsTrigger value="add-new">Aggiungi Nuova</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending" className="mt-6">
          <ModerationTabs activeTab="pending" />
        </TabsContent>
        
        <TabsContent value="approved" className="mt-6">
          <ModerationTabs activeTab="approved" />
        </TabsContent>
        
        <TabsContent value="add-new" className="mt-6">
          <POIFormComponent />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPanel;
