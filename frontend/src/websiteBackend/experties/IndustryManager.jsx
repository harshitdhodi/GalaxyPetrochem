import React, { useState } from 'react';
import CreateIndustryForm from './IndustryExpertyForm';
import IndustryTable from './IndustryTable';

const IndustryManager = () => {
  const [industryId, setIndustryId] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleEdit = (id) => {
    setIndustryId(id);
  };

  const handleSuccess = () => {
    setRefreshKey((prev) => prev + 1); // Trigger table refresh
  };

  return (
    <div className="container mx-auto p-4">
      {industryId && (
        <CreateIndustryForm
          industryId={industryId}
          setIndustryId={setIndustryId}
          onSuccess={handleSuccess}
        />
      )}
      <IndustryTable onEdit={handleEdit} refreshKey={refreshKey} />
    </div>
  );
};

export default IndustryManager;