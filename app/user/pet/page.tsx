'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Heart, Plus, Edit, Trash2, ArrowLeft, PawPrint } from 'lucide-react';
import Link from 'next/link';
import { getUserPets, deleteUserPet } from '@/lib/api/user/pet';

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

export default function PetListPage() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5050";

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    try {
      setLoading(true);
      const response = await getUserPets();

      if (response.success && response.data) {
        setPets(response.data);
      } else {
        setError(response.message || 'Failed to fetch pets');
      }
    } catch (error) {
      console.error('Error fetching pets:', error);
      setError('An error occurred while fetching pets');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePet = async (petId: string) => {
    if (!confirm('Are you sure you want to delete this pet?')) {
      return;
    }

    try {
      const response = await deleteUserPet(petId);

      if (response.success) {
        setPets(pets.filter(pet => pet._id !== petId));
      } else {
        alert(response.message || 'Failed to delete pet');
      }
    } catch (error) {
      console.error('Error deleting pet:', error);
      alert('An error occurred while deleting the pet');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your pets...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <PawPrint className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Pets</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchPets}
            className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-100 text-gray-900 overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-green-300/20 rounded-full blur-3xl top-20 left-10"></div>
        <div className="absolute w-96 h-96 bg-blue-300/20 rounded-full blur-3xl bottom-10 right-10"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-gray-200 backdrop-blur-xl bg-white/80">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </button>
          <h1 className="text-xl font-bold text-gray-900">My Pets</h1>
          <Link
            href="/user/pet/add"
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:shadow-lg hover:shadow-green-500/50 transform hover:scale-105 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span className="font-medium">Add Pet</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        {pets.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center mx-auto mb-6">
              <PawPrint className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No Pets Yet</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start building your pet family! Add your first furry friend to keep track of their health, appointments, and more.
            </p>
            <Link
              href="/user/pet/add"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-green-500/50 transform hover:scale-105 transition-all"
            >
              <Plus className="w-5 h-5" />
              Add Your First Pet
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pets.map((pet) => (
              <div
                key={pet._id}
                className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 group"
              >
                {/* Pet Image */}
                <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg mx-auto mb-4">
                  {pet.imageUrl ? (
                    <Image
                      src={pet.imageUrl.startsWith('http') ? pet.imageUrl : `${baseUrl}${pet.imageUrl}`}
                      alt={pet.name}
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center">
                      <PawPrint className="w-12 h-12 text-white" />
                    </div>
                  )}
                </div>

                {/* Pet Info */}
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{pet.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {pet.species} • {pet.breed}
                  </p>
                  <div className="flex justify-center gap-4 text-xs text-gray-500">
                    <span>Age: {pet.age}y</span>
                    <span>Weight: {pet.weight}kg</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => router.push(`/user/pet/${pet._id}/edit`)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeletePet(pet._id)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}