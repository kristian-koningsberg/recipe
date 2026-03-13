import { recipeProduct } from "@/app/interfaces";
import { client, urlFor } from "@/app/lib/sanity";
import Image from "next/image";
import React, { Suspense } from "react";
import DelayedRender from "../Components/DelayedRender";
// Fetch data for a specific recipe based on the slug
const getData = async (slug: string) => {
  const query = `*[_type == "recipe" && slug.current == "${slug}"][0]{
    _id,
    title, 
    ingredients,
    instructions, 
    description, 
    image{asset},
    "slug": slug.current
  }`;
  const data = await client.fetch(query);
  return data;
};

const RecipePage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params; // <- await the promise
  const data: recipeProduct = await getData(slug);

  if (!data) {
    return <div>Loading...</div>;
  }
  return (
    <DelayedRender>
      <main className="h-screen overflow-auto pt-32 pb-32 px-4 flex flex-col gap-4 items-center">
        <h1 className="text-myPrimary text-center p-4">
          {data.title}
        </h1>
        <div className="max-w-md flex flex-col gap-4 items-center">
          <section className=" flex flex-col gap-4 border-b-2 pb-8">
            <p className="text-xl text-mySecondary">
              {data.description}
            </p>
          </section>
          <section className="w-full flex flex-col gap-4 border-b-2 pt-2 pb-8">
            <h3 className="font-bold underline underline-offset-8 text-mySecondary">
              Ingredienser:
            </h3>
            <ul className="flex flex-col gap-4 text-myBlack">
              {data.ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
          </section>
          <section className="w-full flex flex-col gap-4 border-b-2 pb-8">
            <h3 className="font-bold underline underline-offset-8 text-mySecondary">
              Slik gjør du:
            </h3>
            <ul className="flex flex-col gap-4 text-myBlack">
              {data.instructions.map((instruction, index) => (
                <li key={index}>{instruction}</li>
              ))}
            </ul>
            <Image
              alt="Food is finished"
              src={urlFor(data.image).url()}
              width={500}
              height={500}
            />
          </section>
        </div>
      </main>
    </DelayedRender>
  );
};

export default RecipePage;
