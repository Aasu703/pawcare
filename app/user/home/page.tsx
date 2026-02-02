"use client";

import { useState, useEffect } from "react";
import { Heart, Shield, Calendar, Bell, Settings, LogOut, Home, Sparkles, PawPrint, Activity, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";


export default function ProtectedHome() {
  const { user, logout, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, loading, router]);

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
    const handleMouseMove = (e: MouseEvent) => {
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

  if (loading) {
    return null;
  }

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
      color: "from-amber-500 to-orange-500",
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
    { label: "Active Pets", value: "3", icon: <PawPrint className="w-5 h-5" /> },
    { label: "Appointments", value: "2", icon: <Calendar className="w-5 h-5" /> },
    { label: "Reminders", value: "5", icon: <Bell className="w-5 h-5" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 text-gray-900 overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute w-96 h-96 bg-yellow-300/20 rounded-full blur-3xl"
          style={{
            top: `${20 + scrollY * 0.1}%`,
            left: `${10 + mousePosition.x * 0.01}%`,
            transition: "all 0.3s ease-out"
          }}
        />
        <div 
          className="absolute w-96 h-96 bg-blue-300/20 rounded-full blur-3xl"
          style={{
            bottom: `${10 + scrollY * 0.05}%`,
            right: `${15 + mousePosition.y * 0.01}%`,
            transition: "all 0.3s ease-out"
          }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-gray-200 backdrop-blur-xl bg-white/80">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center shadow-lg">
              <PawPrint className="w-6 h-6 text-gray-900" />
            </div>
            <span className="text-xl font-bold text-gray-900">PawCare</span>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-lg hover:bg-gray-100 transition">
              <Bell className="w-5 h-5 text-gray-700" />
            </button>
            <button 
              onClick={handleProfileClick}
              className="p-2 rounded-lg hover:bg-gray-100 transition group relative"
              title="Edit Profile"
            >
              <User className="w-5 h-5 text-gray-700 group-hover:text-yellow-600 transition-colors" />
              {/* Optional tooltip */}
              <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                Edit Profile
              </span>
            </button>
            <button className="p-2 rounded-lg hover:bg-gray-100 transition">
              <Settings className="w-5 h-5 text-gray-700" />
            </button>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="mb-16">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-yellow-500" />
            <span className="text-yellow-600 font-semibold">Welcome Back</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent">
            {user?.name ? `Hey ${user.name}!` : "Your pet,"}<br />
            {user?.name ? "Welcome back 👋" : "our priority 👋"}
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl">
            {user?.email && (
              <>
                Logged in as <span className="text-yellow-600 font-semibold">{user.email}</span>
              </>
            )}
          </p>

          {/* Stats */}
          <div className="flex flex-wrap gap-4 mb-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="flex items-center gap-3 px-6 py-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition"
              >
                <div className="text-amber-400">
                  {stat.icon}
                </div>
                <div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-xs text-gray-400">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-4">
            <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 font-semibold hover:shadow-lg hover:shadow-amber-500/50 transform hover:scale-105 transition">
              Add New Pet
            </button>
            <button 
              onClick={handleBackToLanding}
              className="px-6 py-3 rounded-xl border border-white/20 font-semibold hover:bg-white/5 transition flex items-center gap-2"
            >
              <Home className="w-5 h-5" />
              Back to Landing
            </button>
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-8">
            <h2 className="text-3xl font-bold">We are best in:</h2>
            <div className="text-4xl">✨</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`group relative p-6 rounded-2xl border ${feature.borderColor} ${feature.bgColor} ${feature.hoverBorder} transition-all duration-300 cursor-pointer transform hover:scale-105 hover:shadow-2xl`}
                onMouseEnter={() => setActiveCard(index)}
                onMouseLeave={() => setActiveCard(null)}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`}
                />
                
                <div className="relative z-10">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    {feature.icon}
                  </div>
                  
                  <h3 className="text-xl font-bold mb-2 group-hover:text-amber-400 transition-colors">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-400 text-sm">
                    {feature.description}
                  </p>

                  <div className={`mt-4 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 text-sm font-semibold bg-gradient-to-r ${feature.color} bg-clip-text text-transparent`}>
                    Explore
                    <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>

                {activeCard === index && (
                  <div className="absolute inset-0 rounded-2xl border-2 border-white/20 pointer-events-none animate-pulse" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Why Rely Section */}
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-12">
          <div className="flex items-center gap-3 mb-8">
            <h2 className="text-3xl font-bold">Why rely on us?</h2>
            <div className="text-4xl animate-bounce">🐾</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Shield className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Peace of mind</h3>
              <p className="text-gray-400">
                Your pet's health records are secure and accessible whenever you need them.
              </p>
            </div>

            <div className="group">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">We love pets</h3>
              <p className="text-gray-400">
                Built by pet lovers, for pet lovers. We understand what your furry friends need.
              </p>
            </div>

            <div className="group">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Smart reminders</h3>
              <p className="text-gray-400">
                Never forget an appointment or medication with our intelligent reminder system.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}