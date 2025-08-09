import React, { useState, useEffect } from "react";
import "./App.css";

export default function App() {
  const [links, setLinks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newLink, setNewLink] = useState("");
  const [newStatus, setNewStatus] = useState("Pending");

  // Load from localStorage
  useEffect(() => {
    const savedLinks = JSON.parse(localStorage.getItem("links")) || [];
    setLinks(savedLinks);
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("links", JSON.stringify(links));
  }, [links]);

 const addLink = () => {
  const formattedLink = newLink.trim();

  if (!formattedLink) return;

  // Auto-add https:// if missing
  const finalUrl = formattedLink.startsWith("http://") || formattedLink.startsWith("https://")
    ? formattedLink
    : `https://${formattedLink}`;

  // Avoid duplicates
  if (links.some(link => link.url === finalUrl)) {
    alert("This link already exists!");
    return;
  }

  const newEntry = {
    id: Date.now(),
    url: finalUrl,
    status: newStatus
  };

  setLinks([newEntry, ...links]);
  setNewLink("");
  setNewStatus("Pending");
  setShowForm(false);
};

  const updateStatus = (id, status) => {
    setLinks(links.map(link => link.id === id ? { ...link, status } : link));
  };

  const deleteLink = (id) => {
    setLinks(links.filter(link => link.id !== id));
  };

  const openLink = (url) => {
    window.open(url, "_blank");
  };

  return (
    <div className="app">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-left">
          <span className="logo">🔗</span>
          <span className="app-name">Link Saver</span>
        </div>
        <div className="navbar-right">
          <a href="#about">About</a>
          <a href="mailto:contact@example.com">Contact</a>
        </div>
      </nav>

      {/* Main */}
      <div className="container">
        <button className="new-btn" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "New Link"}
        </button>

        {showForm && (
          <div className="form">
            <input
              type="text"
              placeholder="Enter link URL..."
              value={newLink}
              onChange={(e) => setNewLink(e.target.value)}
            />
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <option>Pending</option>
              <option>Applied</option>
              <option>Success</option>
              <option>Rejected</option>
            </select>
            <button onClick={addLink}>Add</button>
          </div>
        )}

        <table>
          <thead>
            <tr>
              <th>Link</th>
              <th>Apply</th>
              <th>Status</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {links.map(link => (
              <tr key={link.id}>
                <td>
                  <a href={link.url} target="_blank" rel="noreferrer">
                    {link.url}
                  </a>
                </td>
                <td>
                  <button className="apply-btn" onClick={() => openLink(link.url)}>
                    Apply
                  </button>
                </td>
                <td>
                  <select
                    value={link.status}
                    className={`status ${link.status.toLowerCase()}`}
                    onChange={(e) => updateStatus(link.id, e.target.value)}
                  >
                    <option>Pending</option>
                    <option>Applied</option>
                    <option>Success</option>
                    <option>Rejected</option>
                  </select>
                </td>
                <td>
                  <button className="delete-btn" onClick={() => deleteLink(link.id)}>
                    🗑
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
