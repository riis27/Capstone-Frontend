// Adoption.jsx
import React, { useEffect, useState } from 'react';
import '../styles/Adoption.css';
import BACKEND_URL from '../config';
const PetBox = ({ pet, onVote }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="pet-box">
      <img src={pet.image} alt={pet.name} />
      <h5>{pet.name} <span className="age">({pet.age})</span></h5>

      <button
        className="pet-button"
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? 'Hide' : 'Learn More'}
      </button>

      {expanded && (
        <div className="pet-info">
          <p><strong>Breed:</strong> {pet.breed || 'N/A'} <strong>Sex:</strong> {pet.sex || 'N/A'}</p>
          <p><strong>Disposition:</strong> {pet.disposition || 'N/A'}</p>
          <p><strong>Traits:</strong> {pet.traits || 'N/A'}</p>
          <p><strong>Votes:</strong> {pet.votes ?? 0}</p>
          <div className="vote-buttons mt-2">
            <button
              onClick={() => onVote(pet._id, 'upvote')}
              className="btn btn-outline-success me-2"
            >
              👍 Upvote
            </button>
            <button
              onClick={() => onVote(pet._id, 'downvote')}
              className="btn btn-outline-danger"
            >
              👎 Downvote
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const Adoption = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const BASE_URL = BACKEND_URL + 'pets';

  // Fetch pets
  useEffect(() => {
    const fetchPets = async () => {
      try {
        const res = await fetch(BASE_URL);
        if (!res.ok) throw new Error('Failed to fetch pets');
        const data = await res.json();
        setPets(data);
        setLoading(false);
      } catch (err) {
        console.error('❌ Failed to fetch pets:', err);
        setError('Unable to load pets. Please try again later.');
        setLoading(false);
      }
    };

    fetchPets();
  }, []);

  // Handle voting
  const handleVote = async (petId, voteType) => {
    try {
      const res = await fetch(`${BASE_URL}/${petId}/vote`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ voteType }),
      });

      const data = await res.json();
      const updatedPets = pets.map((pet) =>
        pet._id === petId ? { ...pet, votes: data.votes } : pet
      );
      setPets(updatedPets);
    } catch (err) {
      console.error('❌ Vote error:', err);
    }
  };

  // Handle adding a pet (for admin use)
  const handleAddPet = async (newPet) => {
    const token = localStorage.getItem('authToken');

    try {
      const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newPet),
      });

      if (response.ok) {
        alert('✅ Pet added successfully');
        const updatedList = await fetch(BASE_URL);
        const data = await updatedList.json();
        setPets(data);
      } else {
        alert('❌ Failed to add pet');
      }
    } catch (err) {
      console.error('❌ Error adding pet:', err);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Meet Our Adorable Adoptables</h1>

      {loading ? (
        <p className="text-center">🐾 Loading pets...</p>
      ) : error ? (
        <p className="text-danger text-center">{error}</p>
      ) : pets.length === 0 ? (
        <p className="text-center">No pets available right now.</p>
      ) : (
        <div className="pet-container">
          {pets.map((pet) => (
            <PetBox key={pet._id} pet={pet} onVote={handleVote} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Adoption;
