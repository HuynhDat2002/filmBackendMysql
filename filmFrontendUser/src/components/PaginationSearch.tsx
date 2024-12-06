'use client'
import React,{useState,useEffect} from "react";
import {Pagination} from "@nextui-org/react";
import { useAppDispatch,useAppSelector } from "../lib/hooks";

export default function PageSearch({total}:{total:number}) {
    const [pageTotal,setPageTotal] = useState(0)
   
  return (
    <div className="flex justify-center">
        <Pagination isCompact showControls total={Math.ceil(total/20)} />
    </div>
  );
}
