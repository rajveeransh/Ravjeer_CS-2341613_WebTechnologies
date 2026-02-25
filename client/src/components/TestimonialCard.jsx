/**
 * components/TestimonialCard.jsx
 * Displays a customer testimonial with name, avatar, rating, and quote.
 */

import { FiStar } from 'react-icons/fi';

const TestimonialCard = ({ testimonial }) => {
  const { name, location, rating, text, avatar } = testimonial;

  return (
    <div className="card p-6 bg-white border border-cream-dark">
      {/* Stars */}
      <div className="flex gap-0.5 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <FiStar
            key={i}
            size={15}
            className={i < rating ? 'text-brand-500 fill-brand-500' : 'text-gray-200 fill-gray-200'}
          />
        ))}
      </div>

      {/* Quote */}
      <blockquote className="text-sm text-ink/70 leading-relaxed italic mb-5">
        "{text}"
      </blockquote>

      {/* Author */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 text-white
                        flex items-center justify-center text-sm font-bold flex-shrink-0">
          {avatar || name.charAt(0)}
        </div>
        <div>
          <p className="text-sm font-semibold text-ink">{name}</p>
          {location && <p className="text-xs text-ink/40">{location}</p>}
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
