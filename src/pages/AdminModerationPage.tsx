
import React from 'react';
import Layout from '@/components/Layout';
import POIModerationPanel from '@/components/admin/POIModerationPanel';

const AdminModerationPage = () => {
  return (
    <Layout showSidebar={true}>
      <POIModerationPanel />
    </Layout>
  );
};

export default AdminModerationPage;
