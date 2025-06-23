
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ModerationTabs from './moderation/ModerationTabs';
import POIFormComponent from './form/POIFormComponent';

const AdminPanel: React.FC = () => {
  const navigate = useNavigate();

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">🏛️ Panel di Moderazione POI</h1>
        
        <Button
          variant="outline"
          onClick={handleBackToDashboard}
          className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-300"
        >
          <ArrowLeft className="h-4 w-4" />
          Torna alla Dashboard
        </Button>
      </div>
      
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
