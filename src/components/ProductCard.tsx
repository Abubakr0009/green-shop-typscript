import { Heart, Search, ShoppingCart } from "lucide-react";

// `data` parametrining turi
interface ProductCardProps {
  data: {
    title: string;
    _id: string;
    main_image: string;
    price: number;
    discount_price: number | null;
    category: string;
    discount: boolean;
  };
}

const api = import.meta.env.VITE_API;
const accessToken = JSON.parse(localStorage.getItem("user") || '{}')?.user?._id || '64bebc1e2c6d3f056a8c85b7';

// Utility function to check if the product is in the wishlist
const isInWishlist = (id: string) => {
  const Wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
  return Wishlist.some((item: { flower_id: string }) => item.flower_id === id);
};

// Chegirma foizini hisoblash
const calculateDiscountPercent = (originalPrice: number, discountedPrice: number | null) => {
  if (!originalPrice || !discountedPrice || originalPrice <= discountedPrice) return 0;
  return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
};

export default function ProductCard({ data }: ProductCardProps) {
  if (!data) return null;

  const { title: name, _id: id, main_image, price, discount_price, category: route_path, discount: isSale } = data;
  
  // Wishlist checking
  const wish = isInWishlist(id);

  const discountPercent = calculateDiscountPercent(price, discount_price);

  return (
    <div className="max-w-[300px] w-full border-t-2 border-t-transparent bg-gray-100 text-lg p-2 transi group rounded">
      <div className="card_img relative transi rounded overflow-hidden">
        <div className="bg-[#FBFBFB] transi w-full h-[275px] flex justify-center items-center">
          <img width={250} height={250} priority src={main_image} alt={name} className="w-full h-auto object-contain mix-blend-multiply scale-100" />
        </div>
        <div className="flex justify-center items-center absolute w-full bottom-0 transi gap-0.5 group-hover:opacity-100 opacity-0 group-hover:gap-3 group-hover:bottom-2">
          <button className="p-2 hover:bg-gray-300 transi bg-white rounded cursor-pointer">
            <ShoppingCart size={19} />
          </button>
          <button className="p-2 hover:bg-gray-300 transi bg-white rounded cursor-pointer">
            <Heart size={19} />
          </button>
          <button className="p-2 hover:bg-gray-300 transi bg-white rounded cursor-pointer">
            <Search size={19} />
          </button>
        </div>
        {isSale && discountPercent > 0 && (
          <div className="absolute opacity-100 rounded-br transi top-0 left-0 bg-[#46A358] text-white px-2 py-[2px] font-bold">
            {discountPercent}% <span className="text-sm">OFF</span>
          </div>
        )}
      </div>
      <div>
        <h4 className="font-bold mt-4 group-hover:text-[#46A358] transi">{name}</h4>
        {discountPercent > 0 ? (
          <p className="text-[#46A358] font-semibold">
            ${discount_price ? Number(discount_price).toFixed(2) : "0.00"} 
            <span className="line-through text-gray-400 text-xs">${price.toFixed(2)}</span>
          </p>
        ) : (
          <p className="text-black font-semibold">${price.toFixed(2)}</p>
        )}
      </div>
    </div>
  );
}
