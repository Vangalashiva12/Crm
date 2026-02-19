import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <div
      className="bg-dark text-white p-3"
      style={{ minHeight: "100vh", width: "220px" }}
    >
      <h4>Agentic Ad CRM</h4>

      <ul className="nav flex-column mt-4">

        <li className="nav-item mb-2">
          <NavLink
            to="/"
            className={({ isActive }) =>
              "nav-link text-white " + (isActive ? "fw-bold" : "")
            }
          >
            Dashboard
          </NavLink>
        </li>

        <li className="nav-item mb-2">
          <NavLink
            to="/campaigns"
            className={({ isActive }) =>
              "nav-link text-white " + (isActive ? "fw-bold" : "")
            }
          >
            Campaigns
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink
            to="/add"
            className={({ isActive }) =>
              "nav-link text-white " + (isActive ? "fw-bold" : "")
            }
          >
            Add Campaign
          </NavLink>
        </li>

      </ul>
    </div>
  );
}
