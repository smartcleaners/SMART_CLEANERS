import React, { useState } from 'react';
import { Mail, Phone, MapPin, Award, Zap, Users, ArrowRight, Sparkles } from 'lucide-react';

export const AboutUs = () => {
  const [hoveredCard, setHoveredCard] = useState(null);

  const handleNavigation = (path) => {
    window.location.href = path;
  };

  return (
    <div className="min-h-screen bg-white overflow-hidden">
    

      <section className="py-5 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div>
                <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                  Our Story
                </h2>
                <div className="h-1 w-20 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full"></div>
              </div>
              <div className="space-y-4 text-gray-700">
                <p className="leading-relaxed text-lg">
                  <span className="font-bold text-blue-600">Smart Cleaners</span> is a premium brand based in Hyderabad, operating under the dynamic wing of <span className="font-bold text-blue-600">Priyanka Enterprises</span>. We specialize in providing high-quality chemical products at the best prices.
                </p>
                <p className="leading-relaxed text-lg">
                  For over a decade, we've been the go-to choice for restaurants, hotels, and establishments seeking professional-grade cleaning solutions. We believe in serving everyone with the same premium quality.
                </p>
                <p className="leading-relaxed text-lg font-semibold text-gray-800">
                  Exceptional quality, unbeatable prices, and reliable service—that's our promise.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl transform rotate-3 opacity-20"></div>
              <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 border border-gray-200">
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Award className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">1 year</h3>
                      <p className="text-gray-600">Of trusted service</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Users className="w-6 h-6 text-cyan-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">B2B & B2C</h3>
                      <p className="text-gray-600">Serving all segments</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Zap className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Best Prices</h3>
                      <p className="text-gray-600">Premium quality, affordable</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

   

      {/* Founder Section */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">Meet Our Founder</h2>
            <p className="text-xl text-gray-600">The visionary behind Smart Cleaners</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-3xl opacity-20 blur-3xl"></div>
              <div className="relative w-full aspect-square rounded-3xl overflow-hidden border-8 border-white shadow-2xl bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center">
                <img 
                  src="/image.png" 
                  alt="Mr Sudigollu Hari Babu" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.objectFit = 'contain';
                    e.currentTarget.style.background = '#f5f5f5';
                  }}
                />
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-4xl font-bold mb-2 text-gray-900">Mr Sudigollu Hari Babu</h3>
                <p className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                  Founder & CEO, Priyanka Enterprises
                </p>
              </div>

              <div className="space-y-4 text-gray-700">
                <p className="leading-relaxed text-lg">
                  Mr Hari Babu is a passionate visionary who founded Priyanka Enterprises with a dream to build sustainable, quality-driven businesses. His entrepreneurial spirit has established multiple thriving ventures under the Priyanka Enterprises umbrella.
                </p>
                
                <p className="leading-relaxed text-lg">
                  From innovative credit card businesses to prestigious hospitality brands like five-star hotels, his portfolio demonstrates versatility and business acumen. Smart Cleaners stands as a testament to his commitment to exceptional value.
                </p>

                <p className="leading-relaxed text-lg">
                  Rising from a challenging background with many obstacles, he has overcome hardships through determination and perseverance. His journey from struggle to success inspires everyone around him, and his unwavering commitment to excellence drives Smart Cleaners forward.
                </p>

                <div className="pt-4 px-6 py-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-l-4 border-blue-600">
                  <p className="text-lg font-semibold text-gray-900 italic">
                    "Making things better" is not just a motto—it's my guiding principle in everything I do.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
         <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">Why Choose Smart Cleaners?</h2>
            <p className="text-xl text-gray-600">Industry-leading standards that make the difference</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Award,
                title: "Premium Quality",
                desc: "Certified, professional-grade cleaning chemicals trusted by industry leaders",
                color: "blue"
              },
              {
                icon: Zap,
                title: "Best Prices",
                desc: "Competitive pricing for bulk orders and retail customers without compromise",
                color: "cyan"
              },
              {
                icon: Users,
                title: "B2B & B2C",
                desc: "Serving businesses and individuals with equal commitment and support",
                color: "emerald"
              }
            ].map((feature, idx) => (
              <div
                key={idx}
                onMouseEnter={() => setHoveredCard(idx)}
                onMouseLeave={() => setHoveredCard(null)}
                className={`group relative p-8 rounded-2xl border-2 border-gray-200 bg-white transition-all duration-300 ${
                  hoveredCard === idx 
                    ? 'border-blue-400 shadow-2xl scale-105 -translate-y-2' 
                    : 'hover:border-gray-300'
                }`}
              >
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br from-${feature.color}-500/10 to-${feature.color}-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                
                <div className="relative z-10 space-y-4">
                  <div className={`w-14 h-14 bg-${feature.color}-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className={`w-7 h-7 text-${feature.color}-600`} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                </div>
                
                <div className={`absolute top-4 right-4 w-10 h-10 rounded-full bg-${feature.color}-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300`}>
                  <ArrowRight className={`w-5 h-5 text-${feature.color}-600 group-hover:translate-x-1 transition-transform`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">Our Core Values</h2>
            <p className="text-xl text-gray-600">The principles that guide everything we do</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              { title: "Quality First", desc: "We never compromise on product quality, ensuring every customer receives the best cleaning solutions.", emoji: "✨" },
              { title: "Customer Focused", desc: "Your satisfaction is our priority, whether you're a large hotel chain or an individual household.", emoji: "🎯" },
              { title: "Affordability", desc: "Premium quality doesn't have to be expensive. We believe in fair pricing for everyone.", emoji: "💰" },
              { title: "Reliability", desc: "Consistent quality, timely delivery, and professional service—you can count on us every time.", emoji: "🤝" }
            ].map((value, idx) => (
              <div key={idx} className="group p-8 rounded-2xl border-2 border-gray-200 hover:border-blue-400 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 bg-gradient-to-br from-white to-gray-50">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{value.emoji}</div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-gray-900">{value.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{value.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">Get In Touch</h2>
            <p className="text-xl text-gray-600">We're here to help and answer any questions</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="group bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-blue-400 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Phone className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Phone</h3>
              </div>
              <div className="space-y-3">
                <a href="tel:9014632639" className="block text-lg text-blue-600 hover:text-blue-700 font-semibold transition">
                  90146 32639
                </a>
                <a href="tel:8801800362" className="block text-lg text-blue-600 hover:text-blue-700 font-semibold transition">
                  88018 00362
                </a>
              </div>
            </div>

            <div className="group bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-cyan-400 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Mail className="w-6 h-6 text-cyan-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Email</h3>
              </div>
              <a href="mailto:smartcleaners.shop@gmail.com" className="text-lg text-cyan-600 hover:text-cyan-700 font-semibold transition break-all">
                smartcleaners.shop@gmail.com
              </a>
            </div>

            <div className="group bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-emerald-400 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <MapPin className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Location</h3>
              </div>
              <p className="text-lg text-gray-700 font-semibold">
                Hyderabad, Telangana<br />
                <span className="text-gray-600">India</span>
              </p>
            </div>
          </div>
        </div>
      </section>

     
    </div>
  );
};

export default AboutUs;