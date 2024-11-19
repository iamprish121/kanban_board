import React, { useState, useEffect } from "react";
import "./App.css";
import dp from "./assest/down.svg";
import dp1 from "./assest/Display.svg";


const API_URL = "https://api.quicksell.co/v1/internal/frontend-assignment";

const priorityMap = [  "No Priority", "Low", "Medium", "High", "Urgent"];

const KanbanBoard = () => {
  const [tickets, setTickets] = useState([]);
  const [groupBy, setGroupBy] = useState("status"); // Default grouping
  const [sortBy, setSortBy] = useState(""); // Default sorting
  const [groupedData, setGroupedData] = useState({});
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Dropdown state

  useEffect(() => {
    fetch(API_URL)
      .then((response) => response.json())
      .then((data) => {
        if (data.tickets) {
          setTickets(data.tickets);
        } else {
          console.error("Unexpected API response format:", data);
        }
      })
      .catch((error) => console.error("Error fetching tickets:", error));
  }, []);

  const groupTickets = () => {
    const grouped = tickets.reduce((acc, ticket) => {
      const key =
        groupBy === "status"
          ? ticket.status
          : groupBy === "user"
          ? ticket.user
          : groupBy === "priority"
          ? ticket.priority
          : "unknown";

      if (!acc[key]) acc[key] = [];
      acc[key].push(ticket);
      return acc;
    }, {});

    setGroupedData(grouped);
  };

  useEffect(() => {
    groupTickets();
  }, [groupBy, tickets]);

  const handleSort = () => {
    Object.keys(groupedData).forEach((key) => {
      groupedData[key].sort((a, b) => {
        if (sortBy === "priority") return b.priority - a.priority;
        if (sortBy === "title") return a.title.localeCompare(b.title);
        return 0;
      });
    });
    setGroupedData({ ...groupedData });
  };

  useEffect(() => {
    handleSort();
  }, [sortBy]);

  return (
    <div className="kanban-container">
      <div className="controls">
        <div className="dropdown">
          <button
            className="dropdown-button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <img src={dp1} alt="☰" /> Display <img src={dp} alt="" />
          </button>
          {isDropdownOpen && (
            <div className="dropdown-menu">
              <div className="dropdown-item">
                <label id="group">Grouping</label>
                <select
                  value={groupBy}
                  onChange={(e) => setGroupBy(e.target.value)}
                >
                  <option value="status">Status</option>
                  <option value="user">User</option>
                  <option value="priority">Priority</option>
                </select>
              </div>
              <div className="dropdown-item">
                <label id="group">Ordering</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="">No Sorting</option>
                  <option value="priority">Priority</option>
                  <option value="title">Title</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="kanban-board">
        {Object.keys(groupedData).map((group) => (
          <div key={group} className="kanban-column">
            <h3>{groupBy === "priority" ? priorityMap[group] : group}</h3>
            {groupedData[group].map((ticket) => (
              <div key={ticket.id} className="kanban-card">
                <h4>{ticket.title}</h4>
                <p>Status: {ticket.status}</p>
                <p>User: {ticket.user}</p>
                <p>Priority: {priorityMap[ticket.priority]}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default KanbanBoard;
