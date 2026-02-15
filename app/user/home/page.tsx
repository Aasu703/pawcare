"use client";

import { useState, useEffect } from "react";
import { Heart, Shield, Calendar, Bell, Settings, LogOut, Home, Sparkles, PawPrint, Activity, User, Plus, Eye, Edit, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getUserPets } from "@/lib/api/user/pet";

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


export default function ProtectedHome() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: any, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const [pets, setPets] = useState<Pet[]>([]);
  const [petsLoading, setPetsLoading] = useState(true);
  const [petsError, setPetsError] = useState<string | null>(null);

  const baseUrl = process.env.API_BASE_URL || "http://localhost:5050";

  const handleLogout = async () => {
    await logout();
  };

  const handleBackToLanding = () => {
    router.push("/");
  };

  const handleProfileClick = () => {
    router.push("/user/profile");
  };

  useEffect(() => {
    const handleMouseMove = (data: any) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    try {
      setPetsLoading(true);
      const response = await getUserPets();

      if (response.success && response.data) {
        setPets(response.data);
      } else {
        setPetsError(response.message || 'Failed to fetch pets');
      }
    } catch (error) {
      console.error('Error fetching pets:', error);
      setPetsError('An error occurred while fetching pets');
    } finally {
      setPetsLoading(false);
    }
  };

  const features = [
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Pet Health",
      description: "Track vaccinations, medications, and vet visits",
      color: "from-pink-500 to-rose-500",
      bgColor: "bg-pink-500/10",
      borderColor: "border-pink-500/30",
      hoverBorder: "group-hover:border-pink-500"
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Appointments",
      description: "Schedule and manage upcoming visits",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/30",
      hoverBorder: "group-hover:border-blue-500"
    },
    {
      icon: <Activity className="w-6 h-6" />,
      title: "Activity Tracker",
      description: "Monitor your pet's daily exercise and play",
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/30",
      hoverBorder: "group-hover:border-green-500"
    },
    {
      icon: <Bell className="w-6 h-6" />,
      title: "Reminders",
      description: "Never miss important pet care tasks",
      color: "from-primary to-orange-600",
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-500/30",
      hoverBorder: "group-hover:border-amber-500"
    },
    {
      icon: <PawPrint className="w-6 h-6" />,
      title: "Pet Profile",
      description: "Manage your pet's information and photos",
      color: "from-purple-500 to-violet-500",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/30",
      hoverBorder: "group-hover:border-purple-500"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Insurance",
      description: "Track coverage and file claims easily",
      color: "from-indigo-500 to-blue-500",
      bgColor: "bg-indigo-500/10",
      borderColor: "border-indigo-500/30",
      hoverBorder: "group-hover:border-indigo-500"
    }
  ];

  const stats = [
    { label: "Active Pets", value: petsLoading ? "..." : pets.length.toString(), icon: <PawPrint className="w-5 h-5" /> },
    { label: "Appointments", value: "2", icon: <Calendar className="w-5 h-5" /> },
    { label: "Reminders", value: "5", icon: <Bell className="w-5 h-5" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 text-gray-900 overflow-hidden relative">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <motion.div
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: any, repeat: any, ease: "easeInOut" }}
          className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px]"
        />
        <motion.div
          animate={{
            x: [0, -50, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: any, repeat: any, ease: "easeInOut" }}
          className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-300/20 rounded-full blur-[100px]"
        />
      </div>

      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="relative z-50 border-b border-white/20 backdrop-blur-xl bg-white/70 sticky top-0"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden shadow-lg border-2 border-white">
              <Image src="/images/pawcare.png" alt="PawCare" width={40} height={40} className="object-cover" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700">PawCare</span>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2.5 rounded-full hover:bg-white/50 transition duration-300 relative group">
              <Bell className="w-5 h-5 text-gray-700 group-hover:text-primary transition-colors" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <button
              onClick={handleProfileClick}
              className="px-3 py-1.5 rounded-full bg-white/50 hover:bg-white border border-white/20 transition-all duration-300 flex items-center gap-2 group"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-primary to-blue-500 flex items-center justify-center text-white text-xs font-bold">
                {user?.Firstname?.charAt(0) || <User className="w-4 h-4" />}
              </div>
              <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 hidden sm:block">
                {user?.Firstname || "Profile"}
              </span>
            </button>
            <button
              onClick={handleLogout}
              className="p-2.5 rounded-full hover:bg-red-50 text-gray-700 hover:text-red-500 transition duration-300"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12 space-y-20">
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: any, x: -50 }}
            animate={{ opacity: any, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2 mb-6">
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold flex items-center gap-2 border border-primary/20">
                <Sparkles className="w-4 h-4" />
                Welcome Back
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              {user?.Firstname ? `Hey, ${user.Firstname}!` : "Your pet,"}<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
                {user?.Firstname ? "Ready for care? 🐾" : "our priority 🐾"}
              </span>
            </h1>

            <p className="text-xl text-gray-600 mb-8 max-w-lg leading-relaxed">
              Manage your pets' health, appointments, and daily activities all in one place. We make pet care simple and stress-free.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/user/pet/add">
                <button className="px-8 py-4 rounded-2xl bg-gradient-to-r from-gray-900 to-gray-800 text-white font-semibold hover:from-primary hover:to-blue-600 transition-all duration-300 shadow-xl hover:shadow-primary/25 hover:-translate-y-1 flex items-center gap-3 group">
                  <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                  Add New Pet
                </button>
              </Link>
              <button
                onClick={handleBackToLanding}
                className="px-8 py-4 rounded-2xl bg-white text-gray-900 font-semibold border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-300 shadow-sm hover:translate-y-px"
              >
                Back to Home
              </button>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: any, scale: 0.9 }}
            animate={{ opacity: any, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-2 gap-4"
          >
            {stats.map((stat, index) => (
              <div key={index} className={`bg-white/60 backdrop-blur-xl border border-white/50 p-6 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 ${index === 0 ? 'col-span-2' : ''}`}>
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/10 to-blue-100 flex items-center justify-center text-primary mb-4">
                  {stat.icon}
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm font-medium text-gray-500">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Pets Section */}
        <section>
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Pets</h2>
              <p className="text-gray-500">Manage profiles and health records</p>
            </div>
            <Link href="/user/pet">
              <button className="group flex items-center gap-2 text-primary font-semibold hover:text-blue-700 transition-colors">
                View All Pets
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </div>

          {petsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="h-64 rounded-3xl bg-gray-100 animate-pulse" />
              ))}
            </div>
          ) : petsError ? (
            <div className="bg-red-50 border border-red-200 rounded-3xl p-8 text-center">
              <p className="text-red-600 font-medium mb-4">{petsError}</p>
              <button onClick={fetchPets} className="text-sm underline text-red-700">Try Again</button>
            </div>
          ) : pets.length === 0 ? (
            <div className="bg-gradient-to-br from-white to-gray-50 border border-dashed border-gray-300 rounded-[2rem] p-12 text-center shadow-sm">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <PawPrint className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No Pets Yet</h3>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">Start by adding your first pet to track their health and happiness.</p>
              <Link href="/user/pet/add">
                <button className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-primary/20">
                  <Plus className="w-5 h-5" />
                  Add Pet
                </button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pets.slice(0, 3).map((pet, index) => (
                <motion.div
                  initial={{ opacity: any, y: 20 }}
                  animate={{ opacity: any, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  key={pet._id}
                  onClick={() => router.push(`/user/pet/${pet._id}/edit`)}
                  className="bg-white/80 backdrop-blur-md rounded-[2rem] p-6 border border-white/60 shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 transition-all duration-300 group cursor-pointer relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-500" />

                  <div className="flex items-start gap-4 mb-6">
                    <div className="relative w-24 h-24 rounded-2xl overflow-hidden shadow-md">
                      {pet.imageUrl ? (
                        <img
                          src={pet.imageUrl.startsWith('http') ? pet.imageUrl : `${baseUrl}${pet.imageUrl}`}
                          alt={pet.name}
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                          <PawPrint className="w-10 h-10 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-1">{pet.name}</h3>
                      <p className="text-primary font-medium mb-2">{pet.breed}</p>
                      <div className="flex gap-2 text-xs font-semibold text-gray-500">
                        <span className="px-2 py-1 rounded-lg bg-gray-100">{pet.age} yrs</span>
                        <span className="px-2 py-1 rounded-lg bg-gray-100">{pet.weight} kg</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
                    <button onClick={(e) => { e.stopPropagation(); router.push(`/user/pet/${pet._id}/edit`); }} className="py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold text-sm transition-colors">
                      Edit Profile
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); router.push('/user/pet'); }} className="py-2.5 rounded-xl bg-primary text-white hover:bg-blue-700 font-semibold text-sm transition-colors flex items-center justify-center gap-2">
                      Details <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </motion.div>
              ))}
              {pets.length > 3 && (
                <motion.div
                  initial={{ opacity: any, y: 20 }}
                  animate={{ opacity: any, y: 0 }}
                  transition={{ delay: 0.3 }}
                  onClick={() => router.push('/user/pet')}
                  className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-[2rem] flex flex-col items-center justify-center p-6 cursor-pointer hover:bg-white hover:border-primary/50 hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform">
                    <Plus className="w-8 h-8 text-gray-400 group-hover:text-primary transition-colors" />
                  </div>
                  <span className="font-semibold text-gray-500 group-hover:text-primary transition-colors">View {pets.length - 3} more pets</span>
                </motion.div>
              )}
            </div>
          )}
        </section>

        {/* Features Section */}
        <section>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Everything you need</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">From health tracking to appointment scheduling, we've got you covered.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className={`p-6 rounded-3xl bg-white border border-gray-100 shadow-lg shadow-gray-200/50 hover:shadow-xl hover:border-primary/20 transition-all duration-300 cursor-pointer group flex flex-col items-center text-center`}
                onMouseEnter={() => setActiveCard(index)}
                onMouseLeave={() => setActiveCard(null)}
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1 text-sm md:text-base">{feature.title}</h3>
                <p className="text-xs text-gray-500 hidden md:block">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Why Rely Section */}
        <section className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-[3rem] p-12 relative overflow-hidden text-white">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
            <div className="text-center md:text-left">
              <h2 className="text-3xl font-bold mb-4">Why rely on PawCare?</h2>
              <p className="text-gray-400 mb-8">We combine technology with care to give your pet the best life possible.</p>
              <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto md:mx-0">
                <Heart className="w-8 h-8 text-primary" />
              </div>
            </div>

            <div className="col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                <Shield className="w-10 h-10 text-blue-400 mb-4" />
                <h3 className="text-xl font-bold mb-2">Secure Records</h3>
                <p className="text-sm text-gray-400">Your data is encrypted and safe with us. Access it anytime, anywhere.</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                <Bell className="w-10 h-10 text-orange-400 mb-4" />
                <h3 className="text-xl font-bold mb-2">Smart Alerts</h3>
                <p className="text-sm text-gray-400">Get timely reminders for vaccinations, appointments, and daily medications.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

