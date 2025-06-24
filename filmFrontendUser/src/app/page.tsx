'use client'
import SideBar from "../components/Sidebar";
import clsx from 'clsx'
import { useState } from 'react'
import { FilmIcon, MonitorIcon } from '@iconicicons/react'
import { Tabs, Tab } from "@nextui-org/tabs";
import FilmList from "../components/FilmList";


export default function Home() {




  const [selected, setSelected] = useState<string>("Movie");
  const limitNormal = 16
  const tabs = [
    { name: 'Movies', href: '#', icon: FilmIcon, current: true },
    { name: 'TV Shows', href: '#', icon: MonitorIcon, current: false },
  ]
  console.log('chil')
  type Key = string | number
  return (
    <main className="relative">
      <div className="flex-col mt-10">
        <FilmList
          tab={selected}
        />
      </div>
    </main>
  );
}
