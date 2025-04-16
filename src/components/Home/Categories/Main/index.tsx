

import { Slider } from "antd";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import MainMapping from "../Categories";
import { useSearchParams } from "react-router-dom";

const api = import.meta.env.VITE_API;
const token = import.meta.env.VITE_PUBLIC_ACCESS_TOKEN;

const fetchCategories = async () => {
    const { data } = await axios.get(`${api}flower/category?access_token=${token}`);
    return data;
};

const fetchSaleBanner = async () => {
    const { data } = await axios.get(`${api}features/discount?access_token=${token}`);
    return data;
};

interface SaleBannerData {
    data: {
        poster_image_url: string;
        discount_up_to: number;
    };
}

interface CategoryData {
    id: string;
    title: string;
    route_path: string;
    count: number;
}

const CategoriesMain = () => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [price, setPrice] = useState<[number, number]>([0, 2000]);
    const [searchParams, setSearchParams] = useSearchParams();
    const category = searchParams.get('category');

    const { data, isLoading, isFetching, error } = useQuery({
        queryKey: ["categories"],
        queryFn: fetchCategories,
        staleTime: 1000 * 60 * 5,
        cacheTime: 1000 * 60 * 10,
    });

    const { data: saleBanner, isLoading: isSaleLoading, error: saleError } = useQuery<SaleBannerData>({
        queryKey: ["saleBanner"],
        queryFn: fetchSaleBanner,
    });

    const updateSort = (category: string) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set("category", category);
        setSearchParams(newParams);
        setCurrentPage(1);
    };

    const handleFilterApply = () => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set("range_min", price[0].toString());
        newParams.set("range_max", price[1].toString());
        setSearchParams(newParams);
    };

    useEffect(() => {
        const min = Number(searchParams.get("range_min")) || 0;
        const max = Number(searchParams.get("range_max")) || 2000;
        setPrice([min, max]);
    }, [searchParams]);

    return (
        <div className="max-w-[1240px] px-4 m-auto flex justify-between items-start gap-6 mt-10 text-base">
            <div className="w-[24%] bg-[#FBFBFB] pt-4 rounded-xl overflow-hidden">
                <div className="px-3">
                    <h3 className="font-bold text-lg">Categories</h3>
                    {isLoading || isFetching ? (
                        <ul>
                            {[...Array(9)].map((_, i) => (
                                <li key={i} className="animate-pulse bg-gray-200 h-[24px] my-3 rounded w-[90%] m-auto"></li>
                            ))}
                        </ul>
                    ) : error ? (
                        <p className="text-red-500 text-sm mt-2">Xatolik: {error.message}</p>
                    ) : data?.data && Array.isArray(data.data) ? (
                        <ul className="transi">
                            {data.data.map(({ id, title, route_path, count }: CategoryData) => (
                                <li
                                    key={id}
                                    onClick={() => updateSort(route_path)}
                                    className={`cursor-pointer ${
                                        route_path === category
                                            ? "text-[#46A358] font-semibold"
                                            : "hover:text-[#46A358] font-normal"
                                    } pr-2 my-2 pl-4 text-lg transi flex justify-between items-center`}
                                >
                                    {title}{" "}
                                    <span>
                                        (
                                        {route_path === "seeds"
                                            ? count + 1
                                            : route_path === "house-plants"
                                            ? count + 5
                                            : route_path === "potter-plants"
                                            ? count + 24
                                            : count}
                                        )
                                    </span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500">Kategoriyalar topilmadi.</p>
                    )}
                </div>

                
                <div className="mt-4 px-3">
                    <h2 className="font-semibold mb-2 text-lg">Price Range</h2>
                    <div className="px-3">
                        <Slider
                            range
                            min={0}
                            max={2000}
                            step={1}
                            value={price}
                            trackStyle={[{ backgroundColor: "#46A358" }]}
                            onChange={(value) => setPrice(value as [number, number])}
                        />
                    </div>
                    <p className="text-[#46A358] font-medium text-lg">
                        Price: ${price[0]} – ${price[1]}
                    </p>
                    <button
                        onClick={handleFilterApply}
                        className="cursor-pointer mt-2 px-4 py-2 font-semibold rounded-lg bg-[#46A358] text-lg text-white"
                    >
                        Filter
                    </button>
                </div>

                <div className="relative mt-[10px]">
                    <img
                        src="/images/SuperSaleBanner.svg"
                        alt="greenshop sale banner"
                        className="w-full rounded h-auto mix-blend-multiply"
                    />
                    {saleBanner?.data?.poster_image_url && saleBanner?.data?.discount_up_to ? (
                        <>
                            <p className="absolute top-[20%] w-full text-center font-semibold text-[23px] text-gray-600">
                                UP TO {saleBanner.data.discount_up_to}% OFF
                            </p>
                            <img
                                src={saleBanner.data.poster_image_url}
                                alt="discount ad"
                                className="h-auto mix-blend-multiply absolute bottom-2 left-0"
                            />
                        </>
                    ) : isSaleLoading ? (
                        <p className="text-gray-400 text-sm text-center py-2">Yuklanmoqda...</p>
                    ) : saleError ? (
                        <p className="text-red-500 text-sm mt-2 px-3">Banner xatoligi: {saleError.message}</p>
                    ) : null}
                </div>
            </div>

            <MainMapping currentPage={currentPage} setCurrentPage={setCurrentPage} />
        </div>
    );
};

export default CategoriesMain;
