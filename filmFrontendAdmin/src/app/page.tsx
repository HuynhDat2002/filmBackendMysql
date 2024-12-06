'use client'
import Image from "next/image";
import SideBar from "@/components/Sidebar";
import clsx from 'clsx'
import { useState } from 'react'
import { FilmIcon, MonitorIcon } from '@iconicicons/react'
import { Tabs, Tab } from "@nextui-org/tabs";
import FilmList from "@/components/FilmList";


export default function Home() {




  const [selected, setSelected] = useState<string>("Movie");
  const limitNormal = 16
  const tabs = [
    { name: 'Movies', href: '#', icon: FilmIcon, current: true },
    { name: 'TV Shows', href: '#', icon: MonitorIcon, current: false },
  ]

  type Key = string | number
  return (
    <main className="relative">
      <div className="flex-col">

        <Tabs
          aria-label="Options"
          selectedKey={selected}
          onSelectionChange={(key: Key) => setSelected(key as string)}
          className="flex justify-center gap-4 px-0 my-5"
        >

          {tabs.map((tab) => (
            <Tab
              key={tab.name}
              className={clsx(
                selected === tab.name
                  ? 'border-emerald-400 text-emerald-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                'group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm mr-2 focus:outline-none'
              )}
              title={
                <div className="flex items-center space-x-2">
                  <tab.icon
                    className={clsx(
                      selected === tab.name
                        ? 'text-emerald-400'
                        : 'text-gray-400 group-hover:text-gray-500',
                      '-ml-0.5 mr-2 h-5 w-5'
                    )}
                    aria-hidden="true"
                  />
                  {tab.name}
                </div>
              }
            />

          ))}

        </Tabs>
        <FilmList
          tab={selected}
        />
      </div>
    </main>
  );
}
