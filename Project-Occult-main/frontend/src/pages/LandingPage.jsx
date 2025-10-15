import React, { useState, useEffect, useRef } from 'react';
import { Star, Sparkles, Eye, Orbit, ChevronRight, ChevronDown, Check, Users, BookOpen } from 'lucide-react';
import { Button } from '../components/ui/button';
import ThemeToggle from '@/components/ThemeToggle';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { mockFeatures, mockTestimonials, mockCompatibilityPairs, mockAstroCategories } from '../mock';

const LandingPage = () => {
  const [email, setEmail] = useState('');
  const [scrollY, setScrollY] = useState(0);
  const [illuminationActive, setIlluminationActive] = useState(false);
  
  const canvasRef = useRef(null);
  const heroCanvasRef = useRef(null);
  const heroRef = useRef(null);
  const heroOverlayRef = useRef(null);
  const heroButtonRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  

  // Enhanced starfield canvas with scroll effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = Number.isFinite(document.documentElement.scrollHeight) && document.documentElement.scrollHeight > 0
      ? document.documentElement.scrollHeight
      : window.innerHeight;

    const stars = [];
    const starCount = 300;

    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        baseY: Math.random() * canvas.height,
        radius: Math.random() * 2 + 0.5,
        opacity: Math.random(),
        twinkleSpeed: Math.random() * 0.02 + 0.01,
        parallaxSpeed: Math.random() * 0.5 + 0.3
      });
    }

    let animationId;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      stars.forEach(star => {
        // Twinkling effect
        star.opacity += star.twinkleSpeed;
        if (star.opacity >= 1 || star.opacity <= 0.2) {
          star.twinkleSpeed *= -1;
        }

        // Parallax scroll effect
        const scrollOffset = scrollY * star.parallaxSpeed * 0.5;
        const starY = ((star.baseY + scrollOffset) % (canvas.height || 1));

        if (!Number.isFinite(star.x) || !Number.isFinite(starY) || !Number.isFinite(star.radius)) {
          return;
        }
        ctx.beginPath();
        ctx.arc(star.x, starY, star.radius, 0, Math.PI * 2);
        
        // Gradient glow effect
        const gradient = ctx.createRadialGradient(star.x, starY, 0, star.x, starY, star.radius * 3);
        gradient.addColorStop(0, `rgba(255, 255, 255, ${star.opacity})`);
        gradient.addColorStop(0.5, `rgba(255, 255, 255, ${star.opacity * 0.5})`);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.fillStyle = gradient;
        ctx.fill();
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = document.documentElement.scrollHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, [scrollY]);

  // Hero-specific starfield overlay with scroll parallax
  useEffect(() => {
    const canvas = heroCanvasRef.current;
    const container = heroRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
    };
    resize();

    const stars = [];
    const starCount = 180;
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        baseY: Math.random() * canvas.height,
        radius: Math.random() * 2 + 0.5,
        opacity: Math.random(),
        twinkleSpeed: Math.random() * 0.02 + 0.01,
        parallaxSpeed: Math.random() * 0.5 + 0.3
      });
    }

    let animationId;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      stars.forEach(star => {
        star.opacity += star.twinkleSpeed;
        if (star.opacity >= 1 || star.opacity <= 0.2) {
          star.twinkleSpeed *= -1;
        }

        const scrollOffset = scrollY * star.parallaxSpeed * 0.4;
        const starY = (star.baseY + scrollOffset) % canvas.height;

        ctx.beginPath();
        ctx.arc(star.x, starY, star.radius, 0, Math.PI * 2);

        const gradient = ctx.createRadialGradient(star.x, starY, 0, star.x, starY, star.radius * 3);
        gradient.addColorStop(0, `rgba(255, 255, 255, ${star.opacity})`);
        gradient.addColorStop(0.5, `rgba(255, 255, 255, ${star.opacity * 0.5})`);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.fillStyle = gradient;
        ctx.fill();
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      resize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, [scrollY]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Email submitted:', email);
    alert('Thank you! Your free reading request has been received.');
    setEmail('');
  };

  const handleHeroCtaClick = () => {
    // compute center of button relative to hero section to place illumination
    try {
      if (heroButtonRef.current && heroRef.current && heroOverlayRef.current) {
        const btnRect = heroButtonRef.current.getBoundingClientRect();
        const heroRect = heroRef.current.getBoundingClientRect();
        const x = ((btnRect.left + btnRect.width / 2) - heroRect.left) / heroRect.width * 100;
        const y = ((btnRect.top + btnRect.height / 2) - heroRect.top) / heroRect.height * 100;
        heroOverlayRef.current.style.setProperty('--illum-x', `${x}%`);
        heroOverlayRef.current.style.setProperty('--illum-y', `${y}%`);
      }
    } catch {}

    setIlluminationActive(true);
    // allow illumination to play fully before turning off and scrolling
    setTimeout(() => {
      setIlluminationActive(false);
      const ctaEl = document.getElementById('cta');
      if (ctaEl) ctaEl.scrollIntoView({ behavior: 'smooth' });
    }, 1200);
  };

  return (
    <div className="landing-page">
      {/* Animated Starfield Canvas */}
      <canvas ref={canvasRef} className="starfield-canvas" />

      

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/90 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-wider">COSMIC INSIGHT</h1>
          <div className="flex gap-4 items-center">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wide">Features</a>
            <a href="#compatibility" className="text-sm text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wide">Compatibility</a>
            <a href="#testimonials" className="text-sm text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wide">Testimonials</a>
            <a href="#cta" className="text-sm text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wide">Contact</a>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* Hero Section - Extraordinary */}
      <section ref={heroRef} className="hero-section relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Hero Starfield Canvas */}
        <canvas ref={heroCanvasRef} className="hero-starfield" />
        {/* Hero-scoped illumination overlay */}
        <div ref={heroOverlayRef} className={`hero-illumination-overlay ${illuminationActive ? 'active' : ''}`} />
        {/* Gradient Overlay */}
        <div className="gradient-overlay" />

        {/* Moon Phases */}
        <div className="moon-phases-container">
          <div className="moon-phase new-moon"></div>
          <div className="moon-phase waxing-crescent"></div>
          <div className="moon-phase first-quarter"></div>
          <div className="moon-phase waxing-gibbous"></div>
          <div className="moon-phase full-moon"></div>
          <div className="moon-phase waning-gibbous"></div>
          <div className="moon-phase last-quarter"></div>
          <div className="moon-phase waning-crescent"></div>
        </div>

        <div className="relative z-10 text-center max-w-5xl mx-auto px-6">
          <div className="mb-8 inline-flex items-center gap-2 border border-border rounded-full px-6 py-2 backdrop-blur-sm glow-border animate-fade-in">
            <Orbit size={16} className="animate-spin" style={{ animationDuration: '8s' }} />
            <span className="text-sm tracking-widest uppercase">Where Ancient Wisdom Meets AI</span>
          </div>
          
          <h1 className="hero-title text-8xl font-bold mb-8 leading-tight animate-fade-in-up">
            Discover Your
            <br />
            <span className="cosmic-gradient-text">Cosmic Blueprint</span>
          </h1>
          
          <p className="text-2xl mb-12 text-muted-foreground max-w-3xl mx-auto leading-relaxed animate-fade-in-delayed">
            Unlock the mysteries of your destiny through personalized astrology, numerology, and AI-powered cosmic predictions.
          </p>
          
          <div className="flex gap-4 justify-center items-center animate-fade-in-delayed-more">
            <Button 
              size="lg" 
              className="px-10 py-7 text-xl font-semibold transition-all hover:scale-105 glow-button-strong"
              onClick={handleHeroCtaClick}
              ref={heroButtonRef}
            >
              Get Your Free Reading
              <ChevronRight className="ml-2" size={24} />
            </Button>
          </div>

          <div className="mt-16 flex gap-12 justify-center items-center text-sm text-muted-foreground animate-fade-in-delayed-more">
            <div className="flex items-center gap-2">
              <Check size={16} />
              <span>AI-Powered Predictions</span>
            </div>
            <div className="flex items-center gap-2">
              <Check size={16} />
              <span>Personalized Insights</span>
            </div>
            <div className="flex items-center gap-2">
              <Check size={16} />
              <span>100% Free Analysis</span>
            </div>
          </div>
          {/* Soft scroll hint to features section */}
          <button
            type="button"
            aria-label="Scroll to features"
            onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronDown size={28} className="animate-bounce" />
          </button>
        </div>
      </section>

      {/* Astrological Categories Section */}
      <section className="categories-section py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4">Decode Your Cosmic Influence</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Explore the celestial forces shaping every aspect of your life through detailed astrological analysis.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockAstroCategories.map((category, index) => {
              const Icon = category.icon;
              return (
                <Card 
                  key={index}
                  className="category-card bg-card border border-border hover:bg-accent hover:border-border transition-all duration-300 hover:scale-105"
                >
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className="p-3 bg-muted rounded-lg">
                      <Icon size={24} className="text-foreground" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold mb-2">{category.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{category.description}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Compatibility Section - Inspired by Co-Star */}
      <section id="compatibility" className="compatibility-section py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 border border-border rounded-full px-4 py-2 mb-6">
                <Users size={16} />
                <span className="text-sm uppercase tracking-wider">Relationship Analysis</span>
              </div>
              <h2 className="text-5xl font-bold mb-6">Better Together</h2>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Discover cosmic compatibility with friends, partners, and loved ones. Track astrological dynamics and see if the stars align for your relationships.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <Check className="mt-1 flex-shrink-0" size={20} />
                  <span className="text-muted-foreground">Detailed synastry analysis between birth charts</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="mt-1 flex-shrink-0" size={20} />
                  <span className="text-muted-foreground">Compatibility scores for romantic and platonic relationships</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="mt-1 flex-shrink-0" size={20} />
                  <span className="text-muted-foreground">Track daily astrological influences on your connections</span>
                </li>
              </ul>
              <Button 
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-lg font-semibold"
                onClick={() => document.getElementById('cta').scrollIntoView({ behavior: 'smooth' })}
              >
                Check Compatibility
              </Button>
            </div>

            <div className="space-y-3">
              {mockCompatibilityPairs.map((pair, index) => (
                <Card 
                  key={index}
                  className="compatibility-card bg-card border border-border hover:bg-accent hover:border-border transition-all duration-300"
                >
                  <CardContent className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-lg">{pair.name1}</span>
                        <span className="text-sm text-muted-foreground">{pair.signs1}</span>
                      </div>
                      <div className="text-muted-foreground text-2xl">×</div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-lg">{pair.name2}</span>
                        <span className="text-sm text-muted-foreground">{pair.signs2}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-2xl font-bold">{pair.score}%</div>
                      <ChevronRight size={20} className="text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4">Your Path to Enlightenment</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Combining ancient mystical practices with cutting-edge AI technology for accurate, personalized insights.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {mockFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card 
                  key={index} 
                  className="feature-card bg-card border border-border backdrop-blur-sm hover:bg-accent hover:border-border transition-all duration-300 hover:scale-105"
                >
                  <CardContent className="p-8">
                    <div className="mb-6 inline-flex p-4 bg-muted rounded-full glow-icon">
                      <Icon size={32} className="text-foreground" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="testimonials-section py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4">Trusted by Seekers Worldwide</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Join thousands who have found clarity and purpose through our cosmic guidance.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {mockTestimonials.map((testimonial, index) => (
              <Card 
                key={index}
                className="testimonial-card bg-card border border-border hover:bg-accent hover:border-border transition-all duration-300"
              >
                <CardContent className="p-8">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} fill="currentColor" className="text-primary" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6 leading-relaxed italic">"{testimonial.text}"</p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta" className="cta-section py-24 px-6 relative">
        <div className="max-w-3xl mx-auto text-center">
          <Eye className="mx-auto mb-6 opacity-60 glow-icon" size={60} />
          <h2 className="text-5xl font-bold mb-6">Begin Your Cosmic Journey</h2>
          <p className="text-xl text-muted-foreground mb-12">
            Enter your email to receive your free personalized reading and discover what the universe has in store for you.
          </p>
          
          <form onSubmit={handleSubmit} className="flex gap-4 max-w-xl mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-background border border-border text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring h-14 text-lg glow-input"
            />
            <Button 
              type="submit" 
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 h-14 text-lg font-semibold whitespace-nowrap transition-all hover:scale-105 glow-button"
            >
              Get Free Reading
            </Button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer py-12 px-6 border-t border-border relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h3 className="text-xl font-bold tracking-wider mb-2">COSMIC INSIGHT</h3>
              <p className="text-sm text-muted-foreground">Ancient wisdom. Modern predictions.</p>
            </div>
            
            <div className="flex gap-8 text-sm">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Terms of Service</a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Contact</a>
            </div>
          </div>
          
          <div className="text-center mt-8 pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground">
              © 2025 Cosmic Insight. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;