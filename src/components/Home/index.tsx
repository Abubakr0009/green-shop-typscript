import React from "react";
import Hero from "./Header";
import Categories from "./Categories";

const HomeComponent: React.FC = () => {
  return (
    <div>
      <Hero />
      <Categories />
    </div>
  );
};

export default HomeComponent;
