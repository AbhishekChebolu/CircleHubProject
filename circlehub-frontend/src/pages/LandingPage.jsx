import { useNavigate } from 'react-router-dom';
import { Users, MessageCircle, TrendingUp, Shield, Zap, Heart } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Users,
      title: 'Join Communities',
      description: 'Connect with like-minded people in circles that match your interests',
    },
    {
      icon: MessageCircle,
      title: 'Share & Discuss',
      description: 'Create posts, share experiences, and engage in meaningful conversations',
    },
    {
      icon: TrendingUp,
      title: 'Discover Trends',
      description: 'Stay updated with trending topics and popular circles',
    },
    {
      icon: Shield,
      title: 'Safe & Secure',
      description: 'Your data is protected with enterprise-grade security',
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Optimized for speed with a seamless user experience',
    },
    {
      icon: Heart,
      title: 'Build Connections',
      description: 'Make friends and grow your network in a positive environment',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">C</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary-500 to-primary-600 bg-clip-text text-transparent">
                CircleHub
              </span>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/login')}
                className="px-6 py-2 rounded-xl font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/register')}
                className="btn-primary"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent animate-fade-in">
            Find Your Circle
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-12 max-w-3xl mx-auto animate-slide-up">
            Connect with communities that share your passions. Discover, engage, and grow together.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up">
            <button
              onClick={() => navigate('/register')}
              className="btn-primary text-lg px-8 py-4"
            >
              Join CircleHub
            </button>
            <button className="btn-secondary text-lg px-8 py-4">
              Explore Circles
            </button>
          </div>

          {/* Hero Image/Illustration */}
          <div className="mt-20 relative">
            <div className="glass rounded-3xl p-8 max-w-4xl mx-auto shadow-2xl">
              <div className="grid grid-cols-3 gap-4">
                {['Technology', 'Fitness', 'Travel', 'Photography', 'Food', 'Music'].map((circle, index) => (
                  <div
                    key={circle}
                    className="card p-6 text-center hover:scale-105 transition-all duration-300"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-purple-500 rounded-xl mx-auto mb-3 flex items-center justify-center text-white font-bold shadow-lg">
                      {circle.charAt(0)}
                    </div>
                    <p className="font-semibold text-sm">{circle}</p>
                    <p className="text-xs text-gray-500 mt-1">{Math.floor(Math.random() * 1000)}+ members</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">
            Why Choose CircleHub?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="card p-8 text-center hover:scale-105 transition-all duration-300"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-purple-500 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Join the Community?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Start connecting with people who share your interests today.
          </p>
          <button
            onClick={() => navigate('/register')}
            className="btn-primary text-lg px-12 py-4"
          >
            Create Your Account
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto text-center text-gray-600 dark:text-gray-400">
          <p>&copy; 2026 CircleHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
