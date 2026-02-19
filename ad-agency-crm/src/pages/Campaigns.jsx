import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Campaigns({ campaigns, deleteCampaign}) {
  const navigate = useNavigate();  
  const [search, setSearch] = useState("");

  return (
    <div>
      <h3>Campaigns</h3>
      <input
      type="text"
      placeholder="Search campaigns..."
      className="form-control mt-3"
      value={search}
      onChange={(e) => setSearch(e.target.value)}/>

      <table className="table mt-3">
        <thead>
          <tr>
            <th>Client</th>
            <th>Campaign</th>
            <th>Budget</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
            {campaigns.length === 0 ? (
                <tr>
                    <td colSpan="5" className="text-center text-muted">
                        No campaigns yet. Add one!
                    </td>
                </tr>
            ) : (
                campaigns
                .filter((item) =>
                    item.client.toLowerCase().includes(search.toLowerCase()) ||
                    item.campaign.toLowerCase().includes(search.toLowerCase())
                )
                
                .map((item) => (
                <tr key={item.id}>
                    <td>{item.client}</td>
                    <td>{item.campaign}</td>
                    <td>{item.budget}</td>
                    <td>
                        <span
                        className={"badge " +
                            (item.status === "Running"
                                ? "bg-success"
                                : item.status === "Planning"
                                ? "bg-warning text-dark"
                                : "bg-secondary")
                            }
                        >
                            {item.status}
                        </span>
                    </td>

                    <td>
                        <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={() =>
                            navigate("/add", { state: { campaign: item } })
                        }>
                            Edit
                        </button>
                        
                        <button
                        className="btn btn-danger btn-sm"
                        onClick={() => deleteCampaign(item.id)}
                        >
                            Delete
                        </button>
                    </td>
                </tr>)))}
        </tbody>

      </table>
    </div>
  );
}
