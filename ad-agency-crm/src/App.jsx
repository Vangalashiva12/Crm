import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";

import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Campaigns from "./pages/Campaigns";
import AddCampaign from "./pages/AddCampaign";

import { campaigns as initialData } from "./data/mockData";

export default function App() {

  const [campaigns, setCampaigns] = useState(initialData);

  // ADD campaign
  const addCampaign = (newCampaign) => {
    const newId = Date.now(); 
    setCampaigns([
      ...campaigns,
      {
        ...newCampaign,
        id: newId
      }
    ]);
  };


  // DELETE campaign (must be outside)
  const deleteCampaign = (id) => {
    setCampaigns(campaigns.filter(c => c.id !== id));
  };

  const updateCampaign = (updatedCampaign) => {
  setCampaigns(
    campaigns.map(c =>
      c.id === updatedCampaign.id ? updatedCampaign : c)
    );
  };

  return (
    <BrowserRouter>
      <div className="d-flex">

        <Sidebar />

        <div className="p-4 w-100">
          <Routes>
            <Route path="/" element={<Dashboard
            campaigns={campaigns}
            setCampaigns={setCampaigns}/>} />

            <Route
              path="/campaigns"
              element={
                <Campaigns
                  campaigns={campaigns}
                  deleteCampaign={deleteCampaign}
                />
              }
            />

            <Route
              path="/add"
              element={<AddCampaign 
                addCampaign={addCampaign}
                updateCampaign={updateCampaign} />}
            />
          </Routes>
        </div>

      </div>
    </BrowserRouter>
  );
}
