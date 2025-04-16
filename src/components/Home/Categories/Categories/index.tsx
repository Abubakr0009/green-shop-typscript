import ProductCard from "../../../ProductCard";
import { useState, useRef, useEffect } from "react";
import { SlidersHorizontal } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

const api = import.meta.env.VITE_API;
const accessToken = JSON.parse(localStorage.getItem("user") || '{}')?.user?._id || '64bebc1e2c6d3f056a8c85b7';

interface Product {
  id: string;
  title: string;
  price: number;
  image_url: string;
}

const fetchFlowers = async ({ queryKey }: { queryKey: string[] }) => {
  const [_key, category, sort, filter, min, max] = queryKey;
  const response = await fetch(`${api}flower/category/${category}?access_token=${accessToken}&sort=${sort}&type=${filter}&range_min=${min}&range_max=${max}`);
  const data = await response.json();
  return data?.data || [];
};

interface CategoriesMainProps {
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

const CategoriesMain: React.FC<CategoriesMainProps> = ({ currentPage, setCurrentPage }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sort, setSortOrder] = useState<string>(searchParams.get("sort") || "default-sorting");
  const [selectedFilter, setSelectedFilter] = useState<string>(searchParams.get("type") || "all-plants");
  const topRef = useRef<HTMLDivElement | null>(null);
  const onePage = 9;
  const category = searchParams.get("category") || "house-plants";
  const min = searchParams.get("range_min") || "0";
  const max = searchParams.get("range_max") || "2000";

  useEffect(() => {
    const newParams = { category, sort, type: selectedFilter, range_min: min, range_max: max };
    const currentParams = Object.fromEntries(searchParams.entries());

    if (JSON.stringify(newParams) !== JSON.stringify(currentParams)) {
      setSearchParams(newParams);
    }
  }, [category, sort, selectedFilter, min, max]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const { data: productsData = [], error, isLoading, isFetching } = useQuery<Product[]>({
    queryKey: ["flower", category, sort, selectedFilter, min, max],
    queryFn: () => fetchFlowers({ queryKey: ["flower", category, sort, selectedFilter, min, max] }),
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
  });

  const totalPages = Math.max(1, Math.ceil(productsData.length / onePage));
  const paginatedProducts = productsData.slice((currentPage - 1) * onePage, currentPage * onePage);

  return (
    <div className="w-[76%] lg:pl-5 pt-0 max-lg:w-full">
      <div ref={topRef} className="flex justify-between items-center mb-10">
        <ul className="flex justify-start items-center gap-5 font-semibold">
          {[
            { label: "All Plants", value: "all-plants" },
            { label: "New Arrivals", value: "new-arrivals" },
            { label: "Sale", value: "sale" }
          ].map(({ label, value }) => (
            <li key={value}
                className={`cursor-pointer border-b ${selectedFilter === value ? "text-[#46A358] border-b-[#46A358]" : "hover:text-[#46A358] border-b-transparent"} transi`}
                onClick={() => { setSelectedFilter(value); }}>
              {label}
            </li>
          ))}
        </ul>
        <div className="flex max-md:hidden justify-end gap-3 items-center font-semibold">
          <p>
            Sorting:
            <select name="sort" className="outline-none font-normal" value={sort} onChange={(e) => setSortOrder(e.target.value)}>
              <option value="default-sorting">Default Sorting</option>
              <option value="the-cheapest">The Cheapest</option>
              <option value="most-expensive">Most Expensive</option>
            </select>
          </p>
        </div>
        <button className="md:hidden"><SlidersHorizontal /></button>
      </div>

      {isLoading || isFetching ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 justify-items-center gap-5">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="max-w-[300px] w-full border-t-2 border-t-transparent hover:border-t-[#46A358] transi group rounded">
              <div className="card_img relative transi rounded overflow-hidden">
                <div className="bg-[#FBFBFB] loading transi w-full h-[275px] flex justify-center items-center">
                  <div className="w-full h-auto object-contain mix-blend-multiply scale-100 group-hover:scale-110 transi" />
                </div>
              </div>
              <div>
                <h4 className="transi my-2 w-[60%] loading h-[25px]"></h4>
                <p className="w-[40%] h-[24px] loading"></p>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <h1 className="text-center text-red-500">Something went wrong while fetching the products. Please try again later.</h1>
      ) : paginatedProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 justify-items-center gap-5">
          {paginatedProducts.map((product) => (
            <ProductCard key={product.id} data={product} />
          ))}
        </div>
      ) : (
        <h1 className="text-center">No products available</h1>
      )}
    </div>
  );
};

export default CategoriesMain;
