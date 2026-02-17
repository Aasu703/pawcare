"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getServiceById } from "@/lib/api/public/service";
import { getServicesByProvider } from "@/lib/api/public/service";
import { Star, Clock, DollarSign, MapPin, Phone, Mail, Calendar, ChevronRight, ArrowLeft, User, Award } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ServiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const serviceId = params.id as string;

  const [service, setService] = useState<any>(null);
  const [providerServices, setProviderServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (serviceId) loadData();
  }, [serviceId]);

  const loadData = async () => {
    setLoading(true);
    const serviceRes = await getServiceById(serviceId);

    if (serviceRes.success && serviceRes.data) {
      setService(serviceRes.data);

      const providerId = serviceRes.data.provider?._id || serviceRes.data.providerId;
      if (providerId) {
        const providerServicesRes = await getServicesByProvider(providerId);
        if (providerServicesRes.success && providerServicesRes.data) {
          setProviderServices(providerServicesRes.data.filter((s: any) => s._id !== serviceId));
        }
      }
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50/30 flex items-center justify-center">
        <div className="w-12 h-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50/30 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Service Not Found</h1>
          <p className="text-gray-600 mb-6">The service you're looking for doesn't exist.</p>
          <Link href="/user/services">
            <button className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors">
              Back to Services
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50/30">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-white/60">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Service Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-xl shadow-gray-200/40"
            >
              <div className="flex items-start gap-6 mb-6">
                <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center">
                  <Award className="w-10 h-10 text-primary" />
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{service.title}</h1>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < (service.rating || 0) ? "text-yellow-400 fill-current" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-gray-600">
                      {service.rating ? `${service.rating.toFixed(1)} (${service.reviewCount || 0} reviews)` : "No reviews yet"}
                    </span>
                  </div>
                  <div className="flex items-center gap-6 text-gray-600">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{service.duration_minutes} minutes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      <span className="text-xl font-bold text-gray-900">${service.price}</span>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                {service.description || "No description available for this service."}
              </p>

              <div className="flex gap-4">
                <Link href={`/user/bookings/new?serviceId=${service._id}`} className="flex-1">
                  <button className="w-full bg-primary text-white py-4 rounded-xl font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Book This Service
                  </button>
                </Link>
              </div>
            </motion.div>

            {/* Provider Info */}
            {service.provider && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-xl shadow-gray-200/40"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">About the Provider</h2>
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {service.provider.name || service.provider.businessName || "Provider"}
                    </h3>
                    <div className="space-y-2 text-gray-600">
                      {service.provider.address && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>{service.provider.address}</span>
                        </div>
                      )}
                      {service.provider.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          <span>{service.provider.phone}</span>
                        </div>
                      )}
                      {service.provider.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          <span>{service.provider.email}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Reviews Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-xl shadow-gray-200/40"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Reviews</h2>
              {service.reviews && service.reviews.length > 0 ? (
                <div className="space-y-6">
                  {service.reviews.map((review: any) => (
                    <div key={review._id} className="border-b border-gray-100 pb-6 last:border-b-0 last:pb-0">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">{review.user?.name || "Anonymous"}</span>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No reviews yet. Be the first to review this service!</p>
              )}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Other Services by Provider */}
            {providerServices.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white/80 backdrop-blur-md rounded-3xl p-6 shadow-xl shadow-gray-200/40"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4">Other Services by This Provider</h3>
                <div className="space-y-4">
                  {providerServices.slice(0, 3).map((otherService: any) => (
                    <Link key={otherService._id} href={`/user/services/${otherService._id}`}>
                      <div className="p-4 border border-gray-200 rounded-xl hover:border-primary transition-colors cursor-pointer">
                        <h4 className="font-semibold text-gray-900 mb-1">{otherService.title}</h4>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="w-3 h-3" />
                          <span>{otherService.duration_minutes} min</span>
                          <DollarSign className="w-3 h-3 ml-2" />
                          <span>${otherService.price}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Quick Book */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-primary to-orange-500 rounded-3xl p-6 text-white shadow-xl shadow-primary/30"
            >
              <h3 className="text-xl font-bold mb-4">Ready to Book?</h3>
              <p className="text-white/90 mb-6">
                Secure your spot for {service.title} today. Quick and easy booking process.
              </p>
              <Link href={`/user/bookings/new?serviceId=${service._id}`}>
                <button className="w-full bg-white text-primary py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                  Book Now
                  <ChevronRight className="w-4 h-4" />
                </button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
