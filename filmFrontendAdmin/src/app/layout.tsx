'use client'
import type { Metadata } from "next";
import { useState, useEffect } from 'react'
import { Inter } from "next/font/google";
import Header from "@/components/Header";
const inter = Inter({ subsets: ["latin"] });
import SideBar from "@/components/Header";
import StoreProvider from "./StoreProvider";
import './globals.css'
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import '@smastrom/react-rating/style.css'
import type { NextApiRequest, NextApiResponse } from 'next';
import Menu from '@/components/NavbarMenu'
import React from 'react';
import Head from 'next/head';
import { Suspense } from 'react'

config.autoAddCss = false;
function SearchBarFallback() {
  return <>placeholder</>
}

// export const metadata: Metadata = {
//   title: "Navy Film Admin",
//   description: "Generated by create next app",
// };

export default function RootLayout({  
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  const [isOpenMenu, setIsOpenMenu] = useState(false)
  return (
    <StoreProvider>
      <html lang="en">
        <head>
          <title>Navy Film Admin</title>
          <meta name="description" content="Generated by create next app" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/adminpage/favicon.ico" />
        </head>
        <body className={inter.className}>
          <div className="fixed top-0 left-0 w-full z-50">

          <Header isOpenMenu={isOpenMenu} setIsOpenMenu={setIsOpenMenu} />
          </div>
          <div className="flex flex-col mt-[70px] z-40">
            {isOpenMenu &&
              <div className="transition duration-500 ease-in-out">
                <Menu />
              </div>
            }
            <div className="w-[90%] xl:w-[75%] flex justify-center items-center  mx-auto  shadow-2xl ">
            <Suspense fallback={<SearchBarFallback />}>
              {children}
              </Suspense>
            </div>
          </div>
        </body>
      </html>
    </StoreProvider>
  );
}



