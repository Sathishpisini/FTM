import { Link } from "react-router-dom";

import heroPage from "../../../../src/assets/heroPage.png";
export const Hero = () => {
  return (
    <section className="flex flex-col lg:flex-row dark:text-slate-100 items-center">

      <div className="text my-5">
        <h1 className="text-5xl font-bold">
          The Ultimate Farming products Store
        </h1>

        <p className="text-2xl my-7 px-1 dark:text-slate-300">
          FTM is the world's most popular and authoritative source for Farmers crops.
          Find ratings and access to the newest crops digitally.
        </p>
      </div>

      <div className="visual my-5 lg:max-w-xl">
        <img
          className="rounded-lg max-h-full"
          src={heroPage}
          alt="Hero"
        />
      </div>

    </section>
  );
};