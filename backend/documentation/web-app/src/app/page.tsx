'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Star, Shield, Clock, Award } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SearchBar from '@/components/search/SearchBar';

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');

  const handleSearch = () => {
    if (searchQuery || location) {
      router.push(`/search?q=${searchQuery}&location=${location}`);
    }
  };

  const popularServices = [
    { name: 'Plumbing', icon: '🔧', count: 234 },
    { name: 'Electrical', icon: '⚡', count: 189 },
    { name: 'Cleaning', icon: '🧹', count: 456 },
    { name: 'HVAC', icon: '❄️', count: 156 },
    { name: 'Painting', icon: '🎨', count: 203 },
    { name: 'Carpentry', icon: '🔨', count: 178 },
    { name: 'Landscaping', icon: '🌳', count: 267 },
    { name: 'Moving', icon: '📦', count: 145 },
  ];

  const features = [
    {
      icon: Shield,
      title: 'Verified Professionals',
      description: 'All service providers are background-checked and verified',
    },
    {
      icon: Star,
      title: 'Top-Rated Services',
      description: 'Read reviews from real customers and choose the best',
    },
    {
      icon: Clock,
      title: 'Quick Booking',
      description: 'Book services in minutes and get instant confirmation',
    },
    {
      icon: Award,
      title: 'Quality Guaranteed',
      description: '100% satisfaction guarantee on all services',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">
              Find Trusted Home Service Professionals
            </h1>
            <p className="text-xl mb-8 text-primary-100">
              Connect with verified providers for all your residential and commercial needs
            </p>

            {/* Search Bar */}
            <div className="bg-white rounded-lg shadow-xl p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="What service do you need?"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900"
                  />
                </div>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Enter your location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900"
                  />
                </div>
              </div>
              <button
                onClick={handleSearch}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Search Services
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Services */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Popular Services</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {popularServices.map((service) => (
              <button
                key={service.name}
                onClick={() => router.push(`/search?service=${service.name.toLowerCase()}`)}
                className="p-6 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:shadow-lg transition-all text-center group"
              >
                <div className="text-4xl mb-3">{service.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-1">{service.name}</h3>
                <p className="text-sm text-gray-600">{service.count} providers</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-full mb-4">
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8">Join thousands of satisfied customers</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => router.push('/register')}
              className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition-colors"
            >
              Sign Up
            </button>
            <button
              onClick={() => router.push('/provider/register')}
              className="bg-primary-700 hover:bg-primary-800 border-2 border-white font-semibold py-3 px-8 rounded-lg transition-colors"
            >
              Become a Provider
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
