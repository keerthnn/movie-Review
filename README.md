# movie-Review

Step 1: Initialize Next.js with Page Router
Run the following command in your terminal:
npx create-next-app@latest movie-review-platform
Select "No" for the app router

Step 2: Install Dependencies
cd movie-review-platform
npm install @prisma/client @shadcn/ui firebase pg

Step 3: Set up Prisma
npx prisma init
Update schema.prisma with models for User, Movie, and Review

Step 4: Configure Firebase
Set up Firebase authentication and integrate with Next.js

Step 5: Implement Admin Role & Authorization
Protect routes to allow only admins to add movies

Step 6: Develop UI Components using ShadCN
Use ShadCN for a modern, clean interface

Step 7: Build Movie Review Features
 - Allow admins to add movies
 - Allow users to post reviews
 - Display movies and reviews
