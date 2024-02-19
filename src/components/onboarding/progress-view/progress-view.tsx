"use client";
import { useEffect, useState } from "react";
import CompleteCard from "./complete-card";
import LoadingStagesCards from "./loading-stages-cards";

export type Stage = "deployed" | "booting" | "booted" | "validating" | "complete";
export const STAGES = ["deployed", "booting", "booted", "validating", "complete"]

export default function ProgressView(props: { id: string }) {
    const [status, setStatus] = useState<Stage>("deployed");
    const [url, setUrl] = useState("");

    // TODO refactor this with correct backend changes
    useEffect(() => {
        const getStatus = () => {
            if (status === "complete") {
                return;
            }
            fetch(`//${process.env.NEXT_PUBLIC_SERVER_HOST}/api/deploy/status/${props.id}`, {
                method: "GET",
                headers: new Headers({
                    "Content-Type": "application/json",
                }),
            })
                .then((res) => res.json())
                .then((res) => {
                    setStatus(res.status)
                    if (res.status !== "complete") {
                        setTimeout(getStatus, 2 * 1000);
                    } else {
                        setUrl(res.url)
                    }
                })
                .catch((err) => {
                    console.error(err)
                })
        }
        getStatus();
    }, []);

    if (status === "complete") {
        return <CompleteCard url={url || ""} />
    }

    return <LoadingStagesCards status={status} />
}