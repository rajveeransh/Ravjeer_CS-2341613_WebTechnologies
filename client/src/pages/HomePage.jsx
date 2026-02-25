/**
 * pages/HomePage.jsx
 *
 * The emotional heart of Rupkala.
 * Sections:
 * 1. Hero – "Wear Your Story"
 * 2. Why Rupkala Exists (brand story)
 * 3. Featured Products
 * 4. How It Works (custom design steps)
 * 5. Storytelling: "Every T-Shirt Has a Voice"
 * 6. Testimonials
 * 7. Final CTA
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiUpload, FiType, FiPrinter } from 'react-icons/fi';
import ProductCard       from '../components/ProductCard';
import TestimonialCard   from '../components/TestimonialCard';
import { productService } from '../services/productService';

// ── Static data ──────────────────────────────────────────
const TESTIMONIALS = [
  {
    name:     'Aanya Sharma',
    location: 'Mumbai',
    rating:   5,
    text:     'I uploaded a sketch my daughter made and had it printed. She cried happy tears when she saw it. Rupkala made that possible.',
  },
  {
    name:     'Rohan Mehta',
    location: 'Bengaluru',
    rating:   5,
    text:     'Quality is insane for this price. The print didn\'t fade after 20 washes. My whole friend group wears Rupkala now.',
  },
  {
    name:     'Priya Nair',
    location: 'Kochi',
    rating:   4,
    text:     'Finally a brand that lets me express who I actually am. Not just a catalogue of generic logos — real custom work.',
  },
];

const HOW_IT_WORKS = [
  {
    icon:  <FiUpload size={28} />,
    title: 'Upload Your Vision',
    desc:  'Bring your art, photo, or logo. We\'ll put it exactly where you want.',
  },
  {
    icon:  <FiType size={28} />,
    title: 'Add Your Words',
    desc:  'Type a quote, your name, a date, or anything that means something to you.',
  },
  {
    icon:  <FiPrinter size={28} />,
    title: 'We Print & Deliver',
    desc:  'Premium quality printing, delivered right to your door within 5–7 days.',
  },
];

// ── Component ────────────────────────────────────────────
const HomePage = () => {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    productService.getFeatured()
      .then((res) => setFeatured(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <main>

      {/* ════════════════════════════════════════════════
          1. HERO SECTION – "Wear Your Story"
      ════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center overflow-hidden"
               style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #2d1b69 50%, #1a1a2e 100%)' }}>

        {/* Decorative background shapes */}
        <div className="absolute top-20 right-20 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 left-10 w-64 h-64 bg-brand-600/10 rounded-full blur-2xl animate-float" style={{ animationDelay: '1s' }} />

        <div className="relative z-10 section-wrapper text-white">
          <div className="max-w-3xl">
            {/* Pre-headline tag */}
            <span className="tag-orange mb-6 inline-block animate-fade-in">
              Custom Print-on-Demand
            </span>

            {/* Main headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold leading-tight mb-6 animate-slide-up">
              Wear Your <span className="gradient-text">Story.</span>
            </h1>

            {/* Emotional sub-headline */}
            <p className="text-xl text-white/70 leading-relaxed mb-8 max-w-xl animate-slide-up" style={{ animationDelay: '0.1s' }}>
              Your wardrobe should speak for you. At Rupkala, every tee is a canvas
              for the person you truly are — not the person brands tell you to be.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <Link to="/design" className="btn-primary text-base py-4 px-8">
                Design Your Tee ✨
              </Link>
              <Link to="/products" className="btn-secondary text-base py-4 px-8 border-white/30 text-white hover:bg-white hover:text-ink">
                Explore Collection
              </Link>
            </div>

            {/* Social proof numbers */}
            <div className="flex gap-10 mt-14 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              {[
                { num: '10,000+', label: 'Tees Designed' },
                { num: '4.9★',    label: 'Avg. Rating' },
                { num: '3 Days',  label: 'Avg. Delivery' },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-display font-bold text-brand-400">{stat.num}</p>
                  <p className="text-xs text-white/40 font-accent mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30 animate-bounce">
          <span className="text-xs font-accent tracking-widest">SCROLL</span>
          <div className="w-0.5 h-8 bg-white/20" />
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          2. BRAND STORY – "Why Rupkala Exists"
      ════════════════════════════════════════════════ */}
      <section id="story" className="section-wrapper">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Text side */}
          <div>
            <span className="tag-orange mb-4 inline-block">Our Origin</span>
            <h2 className="text-4xl font-display font-bold text-ink mb-6">
              Why Rupkala Exists
            </h2>
            <div className="space-y-4 text-ink/70 leading-relaxed">
              <p>
                We grew up in a world where fashion was decided by corporations. Every rack in every
                store felt the same — like identity was something to buy off a shelf, not something you owned.
              </p>
              <p>
                Rupkala (रूपकला — <em>Art of Form</em>) was born from a single question:
                <strong className="text-ink"> What if your clothes could say exactly what you mean?</strong>
              </p>
              <p>
                Today, we power custom t-shirts for students, artists, couples, teams, and dreamers across
                India — because we believe personal expression is a right, not a luxury.
              </p>
            </div>
            <div className="flex flex-wrap gap-4 mt-8">
              <Link to="/design" className="btn-primary">
                Start Designing <FiArrowRight size={16} />
              </Link>
            </div>
          </div>

          {/* Values side */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { emoji: '🎨', title: 'Self-Expression',    desc: 'Your clothes are your first language.' },
              { emoji: '♻️', title: 'Responsible Print',  desc: 'Eco-conscious inks, quality first.' },
              { emoji: '🤝', title: 'Community',          desc: 'Wear the same story, stay individual.' },
              { emoji: '✨', title: 'Premium Quality',    desc: 'Soft, durable, worth every rupee.' },
            ].map((v) => (
              <div key={v.title} className="card p-5 bg-cream-dark border-0">
                <span className="text-3xl">{v.emoji}</span>
                <h4 className="text-sm font-semibold text-ink mt-3 mb-1">{v.title}</h4>
                <p className="text-xs text-ink/50">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          3. FEATURED PRODUCTS
      ════════════════════════════════════════════════ */}
      <section className="bg-cream-dark py-20">
        <div className="section-wrapper py-0">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="tag-orange mb-3 inline-block">Hand-picked</span>
              <h2 className="text-3xl font-display font-bold text-ink">Featured Tees</h2>
            </div>
            <Link to="/products" className="btn-ghost hidden sm:flex">
              View All <FiArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            /* Loading skeleton */
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="card animate-pulse">
                  <div className="bg-cream-dark rounded-t-2xl" style={{ aspectRatio: '3/4' }} />
                  <div className="p-4 space-y-2">
                    <div className="h-3 bg-cream-dark rounded w-2/3" />
                    <div className="h-4 bg-cream-dark rounded w-full" />
                    <div className="h-5 bg-cream-dark rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : featured.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {featured.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            /* Empty state (pre-launch) */
            <div className="text-center py-20">
              <p className="text-4xl mb-4">👕</p>
              <p className="text-ink/50">New collection dropping soon. Stay tuned!</p>
            </div>
          )}
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          4. HOW IT WORKS
      ════════════════════════════════════════════════ */}
      <section className="section-wrapper">
        <div className="text-center mb-14">
          <span className="tag-orange mb-4 inline-block">Simple as 1, 2, 3</span>
          <h2 className="text-3xl font-display font-bold text-ink">
            Designed by You. Made for You.
          </h2>
          <p className="text-ink/60 mt-3 max-w-md mx-auto">
            Creating a custom tee that's entirely yours takes less than 5 minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {HOW_IT_WORKS.map((step, i) => (
            <div key={step.title} className="text-center group">
              <div className="w-16 h-16 rounded-2xl bg-brand-100 text-brand-600
                              flex items-center justify-center mx-auto mb-5
                              group-hover:bg-brand-500 group-hover:text-white
                              transition-all duration-300">
                {step.icon}
              </div>
              <span className="text-xs font-accent text-brand-500 mb-2 block">Step {i + 1}</span>
              <h3 className="text-lg font-semibold text-ink mb-2">{step.title}</h3>
              <p className="text-sm text-ink/60 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/design" className="btn-primary text-base py-4 px-10">
            Start Designing Now ✨
          </Link>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          5. STORYTELLING BANNER – "Every T-Shirt Has a Voice"
      ════════════════════════════════════════════════ */}
      <section style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #2d1b69 100%)' }}
               className="py-24 overflow-hidden relative">
        <div className="absolute inset-0 bg-brand-500/5" />
        <div className="section-wrapper relative z-10 text-center text-white">
          <h2 className="text-4xl md:text-5xl font-display font-bold leading-tight mb-6">
            Every T-Shirt Has a Voice.
            <br />
            <span className="gradient-text">Yours Deserves to Be Heard.</span>
          </h2>
          <p className="text-lg text-white/60 max-w-2xl mx-auto mb-8 leading-relaxed">
            The band tee you wore to your first concert. The quote only your friends understand.
            The art you never had the courage to show. Rupkala is where that story gets printed.
          </p>
          <Link to="/design" className="btn-primary text-lg py-4 px-10">
            Tell Your Story
          </Link>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          6. TESTIMONIALS
      ════════════════════════════════════════════════ */}
      <section className="section-wrapper">
        <div className="text-center mb-12">
          <span className="tag-orange mb-4 inline-block">Real People, Real Stories</span>
          <h2 className="text-3xl font-display font-bold text-ink">
            What Our Community Says
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <TestimonialCard key={t.name} testimonial={t} />
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          7. FINAL CTA
      ════════════════════════════════════════════════ */}
      <section className="bg-cream-dark">
        <div className="section-wrapper text-center">
          <h2 className="text-4xl font-display font-bold text-ink mb-4">
            Ready to Make Something Yours?
          </h2>
          <p className="text-ink/60 max-w-md mx-auto mb-8">
            Join 10,000+ people who chose to wear their story, not someone else's.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/design"   className="btn-primary text-base py-4 px-8">Design a Tee</Link>
            <Link to="/products" className="btn-secondary text-base py-4 px-8">Browse Collection</Link>
          </div>
        </div>
      </section>

    </main>
  );
};

export default HomePage;
