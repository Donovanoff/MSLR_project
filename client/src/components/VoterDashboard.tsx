import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "../config";
import { User, Referendum } from "../types";

interface VoterDashboardProps {
  user: User;
  onLogout: () => void;
  updateUser: (updatedUser: User) => void;
}

export const VoterDashboard: React.FC<VoterDashboardProps> = ({ user, onLogout, updateUser }) => {
  const [referendums, setReferendums] = useState<Referendum[]>([]);
  const [loadingRefs, setLoadingRefs] = useState<boolean>(false);
  const [serverMessage, setServerMessage] = useState<string>("");

  useEffect(() => {
    fetchReferendums();
  }, []);

  useEffect(() => {
    if (!serverMessage) return;
    const timer = setTimeout(() => setServerMessage(""), 5000);
    return () => clearTimeout(timer);
  }, [serverMessage]);

  const fetchReferendums = async () => {
    setLoadingRefs(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/referendums`);
      if (response.ok) {
        const data = await response.json();
        setReferendums(data);
      }
    } catch (error) {
      console.warn("Backend unavailable:", error);
    } finally {
      setLoadingRefs(false);
    }
  };

  const handleVote = async (referendumId: string, optionId: string) => {
    setReferendums((prev) =>
      prev.map((ref) => {
        if (ref._id === referendumId) {
          return {
            ...ref,
            options: ref.options.map((opt) =>
              opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
            ),
          };
        }
        return ref;
      })
    );

    const updatedUser = {
      ...user,
      hasVotedIn: [...(user.hasVotedIn || []), referendumId],
    };
    updateUser(updatedUser);

    setServerMessage("You have successfully voted!");

    try {
      const response = await fetch(`${API_BASE_URL}/api/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user._id,
          referendumId,
          optionId,
        }),
      });

      const data = await response.json();
      if (data.isClosedNow) {
        setReferendums((prev) =>
          prev.map((ref) =>
            ref._id === referendumId ? { ...ref, status: "closed" } : ref
          )
        );
      }
    } catch (error) {
      console.error("Error voting:", error);
    }
  };

  const activeReferendums = referendums.filter(r => r.status !== 'draft');

  return (
    <div className="form-container dashboard">
      <div className="dashboard-header">
        <div className="user-info">
          <h2>Welcome, {user.fullName}!</h2>
          <p>{user.email}</p>
        </div>
        <button className="logout-btn" onClick={onLogout}>Log out</button>
      </div>

      {serverMessage && (
        <div className="message-box success" style={{ marginBottom: "15px" }}>
          {serverMessage}
        </div>
      )}

      <div className="dashboard-content">
        {loadingRefs ? (
          <p>Loading...</p>
        ) : activeReferendums.length === 0 ? (
          <p>No active referendums.</p>
        ) : (
          activeReferendums.map((ref) => {
            const hasVoted = user.hasVotedIn && user.hasVotedIn.includes(ref._id);

            return (
              <div key={ref._id} className="referendum-card">
                <span className={`status-badge status-${ref.status}`}>{ref.status}</span>
                <h3 className="referendum-title">{ref.title}</h3>
                <p className="referendum-desc">{ref.description}</p>

                <div className="referendum-options">
                  {ref.options.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => handleVote(ref._id, opt.id)}
                      disabled={hasVoted || ref.status !== 'open'}
                      className={`option-btn ${(hasVoted || ref.status !== 'open') ? "disabled" : ""}`}
                    >
                      <span className="option-text">{opt.text}</span>
                      <span className="vote-count">{opt.votes} votes</span>
                    </button>
                  ))}
                </div>

                {hasVoted && <p className="voted-badge">✓ You voted</p>}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
