"use client";
import { useEffect, useState } from "react";
import CompleteCard from "./complete-card";
import LoadingStagesCards from "./loading-stages-cards";

export enum Stages {
    STARTING = "STARTING",
    STARTED = "STARTED",
    DEPLOYED = "DEPLOYED",
    COMPLETE = "COMPLETE"
}

export const STAGES = Object.keys(Stages);

export default function ProgressView(props: { id: string }) {
    const [status, setStatus] = useState<keyof typeof Stages>(Stages.STARTING);
    const [url, setUrl] = useState("");

    // TODO refactor this with correct backend changes
    useEffect(() => {
        const getStatus = () => {
            if (status === Stages.STARTING) {
                return;
            }
            fetch("http://localhost:3001/status", {
                method: "POST",
                headers: new Headers({
                    "Content-Type": "application/json",
                }),
                body: JSON.stringify({
                    id: props.id
                }),
            })
                .then((res) => res.json())
                .then((res) => {
                    setStatus(res.status)
                    if (res.status !== Stages.COMPLETE) {
                        setTimeout(getStatus, 2 * 1000);
                    } else {
                        setUrl(res.url)
                    }
                    console.log(res)
                })
                .catch((err) => {
                    console.error(err)
                })
        }
        getStatus();
    }, []);

    if (status === Stages.COMPLETE) {
        return <CompleteCard url={url || ""} />
    }

    return <LoadingStagesCards status={status} />
}