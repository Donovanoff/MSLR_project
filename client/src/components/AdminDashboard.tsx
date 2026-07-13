import React, { useState, useEffect, FormEvent } from "react";
import { API_BASE_URL } from "../config";
import { User, Referendum } from "../types";

interface AdminDashboardProps {
  user: User;
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onLogout }) => {
  const [referendums, setReferendums] = useState<Referendum[]>([]);
  const [refTitle, setRefTitle] = useState("");
  const [refDesc, setRefDesc] = useState("");
  const [refOptions, setRefOptions] = useState<string[]>(["", ""]);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchReferendums();
  }, []);

  const fetchReferendums = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/referendums`);
      if (response.ok) {
        const data = await response.json();
        setReferendums(data);
      }
    } catch (error) {
      console.error("Failed to fetch referendums", error);
    }
  };

  const handleCreateReferendum = async (e: FormEvent) => {
    e.preventDefault();

    if (!refTitle || refOptions.some(opt => !opt.trim())) {
      return alert("Ensure title and all options are filled!");
    }

    const payload = {
      title: refTitle,
      description: refDesc,
      options: refOptions.map((text, index) => ({
        id: (index + 1).toString(),
        text: text,
        votes: 0
      }))
    };

    try {
      if (editingId) {
        await fetch(`${API_BASE_URL}/api/referendums/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        alert("Changes saved!");
        setEditingId(null);
      } else {
        await fetch(`${API_BASE_URL}/api/referendums`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        alert("Referendum created!");
      }

      setRefTitle("");
      setRefDesc("");
      setRefOptions(["", ""]);
      fetchReferendums();
    } catch (e) { alert("Error"); }
  };

  const changeStatus = async (id: string, status: string) => {
    await fetch(`${API_BASE_URL}/api/referendums/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchReferendums();
  };

  const startEditing = (ref: Referendum) => {
    setEditingId(ref._id);
    setRefTitle(ref.title);
    setRefDesc(ref.description);
    setRefOptions(ref.options.map(o => o.text));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOptionChange = (index: number, value: string) => {
    const updated = [...refOptions];
    updated[index] = value;
    setRefOptions(updated);
  };

  const addOptionField = () => setRefOptions([...refOptions, ""]);

  const removeOptionField = (index: number) => {
    if (refOptions.length <= 2) return alert("Minimum two options required.");
    const updated = refOptions.filter((_, i) => i !== index);
    setRefOptions(updated);
  };

  const deleteRef = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this referendum?")) return;
    await fetch(`${API_BASE_URL}/api/referendums/${id}`, { method: "DELETE" });
    fetchReferendums();
  };

  return (
    <div className="form-container dashboard">
      <div className="dashboard-header">
        <div className="user-info">
          <h2>🏛️ Election Commission</h2>
          <p>{user.email}</p>
        </div>
        <button className="logout-btn" onClick={onLogout}>Log out</button>
      </div>

      <div className="create-form">
        <div style={{display:'flex', justifyContent:'space-between', marginBottom:'15px'}}>
           <h3>{editingId ? "✏️ Edit" : "+ New Referendum"}</h3>
           {editingId && (
              <button className="btn-cancel-edit" onClick={() => {
               setEditingId(null);
               setRefTitle(""); setRefDesc(""); setRefOptions(["", ""]);
             }}>Cancel</button>
           )}
        </div>
        
        <input placeholder="Title" value={refTitle} onChange={e => setRefTitle(e.target.value)} />
        <textarea placeholder="Description" value={refDesc} onChange={e => setRefDesc(e.target.value)} />

        <h4 className="options-label">Options:</h4>
        {refOptions.map((opt, index) => (
          <div key={index} className="option-dynamic-row">
            <input placeholder={`Option ${index + 1}`} value={opt} onChange={e => handleOptionChange(index, e.target.value)} />
            {refOptions.length > 2 && (
              <button type="button" className="btn-remove-option" onClick={() => removeOptionField(index)} title="Remove option">✕</button>
            )}
          </div>
        ))}
        <button type="button" className="btn-add-option" onClick={addOptionField}>+ Add Option</button>
        <button onClick={handleCreateReferendum}>{editingId ? "Save Changes" : "Create Draft"}</button>
      </div>

      <h3>Referendums</h3>
      <div className="dashboard-content">
        {referendums.map((ref) => (
          <div key={ref._id} className="referendum-card">
            <span className={`status-badge status-${ref.status}`}>{ref.status}</span>
            <h3 className="referendum-title">{ref.title}</h3>
            <div style={{background: '#eee', padding: '10px', borderRadius: '5px', fontSize: '0.9rem', marginBottom: '10px'}}>
               {ref.options.map(o => <div key={o.id}><strong>{o.text}:</strong> {o.votes} votes</div>)}
            </div>
            <div className="admin-controls">
              {ref.status === 'draft' && <button className="btn-sm btn-orange" onClick={() => startEditing(ref)} style={{marginRight:'auto'}}>✏️ Edit</button>}
              {ref.status === 'draft' && <button className="btn-sm btn-green" onClick={() => changeStatus(ref._id, 'open')}>🚀 Open</button>}
              {ref.status === 'open' && <button className="btn-sm btn-orange" onClick={() => changeStatus(ref._id, 'closed')}>🔒 Close</button>}
              {ref.status === 'closed' && <button className="btn-sm btn-green" onClick={() => changeStatus(ref._id, 'open')}>🔓 Re-open</button>}
              <button className="btn-sm btn-red" onClick={() => deleteRef(ref._id)}>🗑️ Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
