import { Alert } from "@nextui-org/react";
import { useState, useEffect } from "react";

export default function AlertInfo({ info, color,close }: { info: string, color: string,close:()=>void }) {
    const [isVisible, setIsVisible] = useState(false);
    useEffect(() => {
        setIsVisible(true);
    }, []);
    useEffect(() => {
        setTimeout(() => {
            setIsVisible(false);
            close()
        }, 3000)
    },[isVisible])
    return (
        <div className={`transition transform ${isVisible ? "translate-x-0": "translate-x-60"}   opacity-100 duration-700 ease-in-out transform flex items-center justify-center fixed top-4 right-4 z-50`}>
            <div className="flex flex-col w-full">

                <div key={color} className="w-full flex items-center my-3">
                    <Alert color={color} title={`${info} `} />
                </div>

            </div>
        </div>
    );
}