import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";


export default function AddCampaign({ addCampaign, updateCampaign }) {

  const location = useLocation();
  const navigate = useNavigate();
  const editingCampaign = location.state?.campaign;

  const [form, setForm] = useState({
    client: "",
    campaign: "",
    budget: "",
    status: "Planning",
  });

  // Auto-fill form if editing
  useEffect(() => {
    if (editingCampaign) {
      setForm(editingCampaign);
    }
  }, [editingCampaign]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingCampaign) {
        updateCampaign(form);
    } else {
        addCampaign(form);
    }
    
    navigate("/campaigns");

  };

  return (
    <div>
      <h3>{editingCampaign ? "Edit Campaign" : "Add Campaign"}</h3>

      <form onSubmit={handleSubmit} className="mt-3">

        <div className="mb-3">
          <label>Client</label>
          <input
            name="client"
            className="form-control"
            value={form.client}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label>Campaign Name</label>
          <input
            name="campaign"
            className="form-control"
            value={form.campaign}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label>Budget</label>
          <input
            name="budget"
            className="form-control"
            value={form.budget}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label>Status</label>
          <select
            name="status"
            className="form-control"
            value={form.status}
            onChange={handleChange}
          >
            <option>Planning</option>
            <option>Running</option>
            <option>Completed</option>
          </select>
        </div>

        <button className="btn btn-primary">
          {editingCampaign ? "Update Campaign" : "Add Campaign"}
        </button>

      </form>
    </div>
  );
}
