import { defineCollection } from "astro:content";

import { z } from "astro:content";

const blogsCollection = defineCollection({
    schema: z.object({
      title: z.string(),
    }),
  });
  

  export const collections = {
    'blogs': blogsCollection,
  };