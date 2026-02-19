import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useState } from "react";
import { useEffect, useRef } from "react";


ChartJS.register(ArcElement, Tooltip, Legend);

export default function Dashboard({ campaigns, setCampaigns }) {

  const totalCampaigns = campaigns.length;
  const [aiInsight, setAiInsight] = useState("");
  const [loading, setLoading] = useState(false);
  const [agentActions, setAgentActions] = useState([]);
  const allowedStatuses = ["Running", "Planning", "Completed"];
  const lastHash = useRef(null);


  const applyAgentAction = (action) => {
    if (action.type === "update_status") {
        if (!allowedStatuses.includes(action.new_status)) {
            console.warn("Invalid AI status:", action.new_status);
            return;
        }

        const updated = campaigns.map(c =>
            c.id === action.id
            ? { ...c, status: action.new_status }
            : c
        );

        setCampaigns(updated);
    }
  };


  const running = campaigns.filter(c => c.status === "Running").length;
  const planning = campaigns.filter(c => c.status === "Planning").length;
  const completed = campaigns.filter(c => c.status === "Completed").length;
  const chartData = {
    labels: ["Running", "Planning", "Completed"],
    datasets: [
        {
            label: "Campaign Status",
            data: [running, planning, completed],
            backgroundColor: ["#0d6efd", "#ffc107", "#198754"],
        },
    ],
  };

  let insight = "Balanced campaign distribution";
  
  if (running > planning && running > completed) {
    insight = "Most campaigns are currently running";
  } else if (planning > running && planning > completed) {
    insight = "Many campaigns are still in planning phase";
  } else if (completed > running && completed > planning) {
    insight = "Majority of campaigns are completed";
  }

  const generateAIInsight = async () => {
    try {
        setLoading(true);
        
        const res = await fetch("http://localhost:5000/api/agent/analyze", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ campaigns }),
        });
        
        const data = await res.json();
        setAiInsight(data.insight);
        setAgentActions(data.actions || []);
    } catch (error) {
        console.error(error);
    } finally {
    setLoading(false);
    }
  };

  useEffect(() => {
    const currentHash = JSON.stringify(campaigns);
    if (currentHash === lastHash.current) return;
    lastHash.current = currentHash;
    const timer = setTimeout(() => {
        generateAIInsight();
    }, 1500); // debounce to prevent spam
    return () => clearTimeout(timer);
  }, [campaigns]);



  return (
    <div>
      <div className="d-flex justify-content-between align-items-center">
        <h3>Dashboard</h3>
        <span className="text-muted">Ad Agency Analytics</span>
        </div>
      <div className="alert alert-primary">
        Agentic Ad CRM — Frontend MVP demonstrating campaign management,
        analytics insights, and intelligent workflow visualization.
        </div>


      <div className="row mt-4">

        <div className="col-md-3">
          <div className="card p-3">
            <h5>Total Campaigns</h5>
            <h3>{totalCampaigns}</h3>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card p-3">
            <h5>Running</h5>
            <h3>{running}</h3>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card p-3">
            <h5>Planning</h5>
            <h3>{planning}</h3>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card p-3">
            <h5>Completed</h5>
            <h3>{completed}</h3>
          </div>
        </div>

      </div>
      <div className="mt-5" style={{maxWidth:"400px"}}>
        <Pie data={chartData} />
        </div>
      <div className="alert alert-info mt-4">
        <strong>Smart Insight:</strong> {insight}
        </div>

        <button
        className="btn btn-primary mt-3"
        onClick={generateAIInsight}>
            Generate AI Insight
        </button>

        {loading && <p className="mt-3">AI thinking...</p>}
        
        {aiInsight && (
            <div className="alert alert-success mt-3">
                <strong>AI Insight:</strong>
                <pre style={{whiteSpace: "pre-wrap"}}>
                    {aiInsight}
                </pre>
            </div>
        )}

        {agentActions.length > 0 && (
            <div className="mt-3">
                <h5>AI Suggested Actions</h5>
                {agentActions.map((action, index) => (
                    <div key={index} className="card p-2 mb-2">
                        <p>
                            Update Campaign #{action.id} →
                            Status: <strong>{action.new_status}</strong>
                        </p>
                        <button
                        className="btn btn-success btn-sm"
                        onClick={() => applyAgentAction(action)}>
                            Apply Action
                        </button>
                    </div>
                ))}
            </div>
        )}

    </div>
  );
}
