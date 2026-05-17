"use client";

import { createTRPCReact } from "@trpc/react-query";

// Simplified trpc setup for deployment - types will be restored after backend is live
export const trpc = createTRPCReact();
