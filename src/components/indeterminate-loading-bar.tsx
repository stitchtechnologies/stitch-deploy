import { useEffect, useState } from "react";
import { Progress } from "./ui/progress";

export default function IndeterminateProgressBar() {
    const [loadingValue, setLoadingValue] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setLoadingValue((old) => {
                const newValue = old + Math.floor(Math.random() * 10);
                return newValue >= 100 ? old : newValue;
            })
        }, Math.floor(Math.random() * 7000) + 3000);
        return () => clearInterval(interval);
    }, [])

    return <Progress value={loadingValue} className="h-2" />
}