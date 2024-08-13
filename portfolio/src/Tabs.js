import React, { useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css'; // Import default styles

import UploadForm from './UploadForm';
import ImageList from './ImageList';

const TabbedInterface = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="TabbedInterface">
      <Tabs selectedIndex={activeTab} onSelect={(index) => setActiveTab(index)}>
        <TabList>
          <Tab>Upload</Tab>
          <Tab>Image List</Tab>
        </TabList>

        <TabPanel>
          <UploadForm />
        </TabPanel>
        <TabPanel>
          <ImageList />
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default TabbedInterface;
