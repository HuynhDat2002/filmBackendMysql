'use client'
import React,{useState,useEffect} from "react";
import {Pagination} from "@heroui/react";
import { useAppDispatch,useAppSelector } from "../lib/hooks";

export default function Pagi({total,onPageChange}:{total:number,onPageChange:(page: number)=>void}) {
  console.log('total', total)   
  return (
    <div className="flex justify-center">
        <Pagination isCompact showControls total={total||1} initialPage={1} onChange={onPageChange}/>
    </div>
  );
}
