import { Heart, Calendar } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ListingCardProps {
  image: string;
  title: string;
  price: number;
  postedDate: string;
  condition: string;
  onClick?: () => void;
}

export function ListingCard({ image, title, price, postedDate, condition, onClick }: ListingCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
    >
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <ImageWithFallback
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">{title}</h3>
        <p className="text-2xl font-bold text-red-600 mb-2">${price}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            <span>{postedDate}</span>
          </div>
          <span className="inline-block bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full">
            {condition}
          </span>
        </div>
      </div>
    </div>
  );
}