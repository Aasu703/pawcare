'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import UpdatePetForm from '../../../_components/UpdatePet';
import { getUserPetById } from '@/lib/api/user/pet';
import { PawPrint } from 'lucide-react';

interface Pet {
  _id: string;
  name: string;
  species: string;
  breed: string;
  age: number;
  weight: number;
  imageUrl?: string;
  createdAt: string;
}

export default function EditPetPage() {
  const params = useParams();
  const petId = params.id as string;
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (petId) {
      fetchPet();
    }
  }, [petId]);

  const fetchPet = async () => {
    try {
      setLoading(true);
      const response = await getUserPetById(petId);

      if (response.success && response.data) {
        setPet(response.data);
      } else {
        setError(response.message || 'Failed to fetch pet');
      }
    } catch (error) {
      console.error('Error fetching pet:', error);
      setError('An error occurred while fetching the pet');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading pet details...</p>
        </div>
      </div>
    );
  }

  if (error || !pet) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <PawPrint className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Pet</h2>
          <p className="text-gray-600 mb-6">{error || 'Pet not found'}</p>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return <UpdatePetForm pet={pet} />;
}