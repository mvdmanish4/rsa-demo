import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useConfigStore } from '../store/configStore';
import { getLighterColor } from '../utils/colors';

interface ProductCardProps {
  title: string;
  price: string;
  image: string;
  description: string;
}

export default function ProductCard({ title, price, image, description }: ProductCardProps) {
  const config = useConfigStore((state) => state.config);
  const backgroundColor = getLighterColor(config.color_hex || '#F2E3C9');
  
  const handleAddToCart = () => {
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in-up';
    toast.textContent = 'Add to Cart not available';
    document.body.appendChild(toast);

    // Remove toast after 3 seconds
    setTimeout(() => {
      toast.classList.add('animate-fade-out');
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, 3000);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img src={image} alt={title} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1">{title}</h3>
        <p className="text-gray-600 text-sm mb-2">{description}</p>
        <div className="flex items-center justify-between">
          <span className="font-bold text-lg">${price}</span>
          <button 
            onClick={handleAddToCart}
            className="p-2 rounded-full transition-colors hover:opacity-90"
            style={{ backgroundColor }}
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}