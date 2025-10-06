/**
 * Register Page - Modern UX/UI Design
 * Split-screen layout with professional branding and animations
 */
import { useNavigate } from 'react-router-dom';
import { RegisterForm } from '../components/RegisterForm';
import { Logo } from '@/components/common/Logo';
import {
  SparklesIcon,
  UsersIcon,
  ChartBarIcon,
  LightBulbIcon,
} from '@heroicons/react/24/outline';

export function RegisterPage() {
  const navigate = useNavigate();

  const handleSuccess = () => {
    // Redirect handled by RegisterForm success state
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Hero Section with Brand */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-teal-600 via-teal-500 to-green-500 p-12 flex-col justify-between overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        {/* Content */}
        <div className="relative z-10">
          {/* Logo */}
          <div className="mb-12">
            <Logo
              variant="horizontal"
              size={80}
              primaryColor="#FFFFFF"
              secondaryColor="#F0FDFA"
              className="drop-shadow-lg"
            />
          </div>

          {/* Hero Text */}
          <div className="max-w-md">
            <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
              Your intelligent financial assistant
            </h1>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Take control of your finances with AI-powered insights, collaborative budgeting, and smart expense tracking.
            </p>

            {/* Features List */}
            <div className="space-y-4">
              {[
                {
                  icon: SparklesIcon,
                  text: 'AI-powered categorization',
                },
                {
                  icon: UsersIcon,
                  text: 'Collaborative spaces for couples & roommates',
                },
                {
                  icon: ChartBarIcon,
                  text: 'Real-time budget tracking',
                },
                {
                  icon: LightBulbIcon,
                  text: 'Smart financial insights',
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 text-white/90"
                  style={{
                    animation: `slideInLeft 0.6s ease-out ${index * 0.1}s both`,
                  }}
                >
                  <div className="flex-shrink-0 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                    <feature.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-lg">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="relative z-10 grid grid-cols-3 gap-8">
          {[
            { number: '10K+', label: 'Active Users' },
            { number: '$2M+', label: 'Money Saved' },
            { number: '4.9', label: 'User Rating' },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl font-bold text-white mb-1">
                {stat.number}
              </div>
              <div className="text-sm text-white/80">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Side - Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex flex-col items-center mb-4">
              <Logo
                variant="vertical"
                size={80}
                primaryColor="#14B8A6"
                secondaryColor="#4ADE80"
              />
            </div>
            <p className="text-gray-600">Your intelligent financial assistant</p>
          </div>

          {/* Form Component */}
          <RegisterForm
            onSuccess={handleSuccess}
            onLoginClick={handleLoginClick}
          />

          {/* Footer */}
          <div className="mt-8 text-center text-xs text-gray-500">
            <p>
              By signing up, you agree to our{' '}
              <a href="/terms" className="text-teal-600 hover:text-teal-700 font-medium transition">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="/privacy" className="text-teal-600 hover:text-teal-700 font-medium transition">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Custom CSS Animations */}
      <style>{`
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}
