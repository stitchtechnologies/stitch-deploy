"use client";
import { useEffect, useState } from "react";
import CompleteCard from "./complete-card";
import LoadingStagesCards from "./loading-stages-cards";
import { Deployment } from "@prisma/client";

export type Stage = "deployed" | "booting" | "booted" | "validating" | "complete";
export const STAGES = ["deployed", "booting", "booted", "validating", "complete"]

export default function ProgressView(props: { id: string }) {
    const [status, setStatus] = useState<Stage>("deployed");
    const [url, setUrl] = useState("");
    const [publicDns, setPublicDns] = useState("");
    const [showValidation, setShowValidation] = useState<boolean>(false);
    const [failedRetries, setFailedRetries] = useState(0);

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
                .then((res: Deployment) => {
                    setStatus(res.status as Stage)
                    setShowValidation(res.validationUrl != null)
                    setUrl(res.userFriendlyUrl || "")
                    setPublicDns(res.publicDns || "")
                    if (res.status !== "complete") {
                        setTimeout(getStatus, 2 * 1000);
                    }
                })
                .catch((err) => {
                    console.error(err)
                    if (failedRetries <= 5) {
                        setTimeout(getStatus, 2 * 1000);
                        setFailedRetries(prev => prev + 1);
                    }
                })
        }
        getStatus();
    }, [failedRetries, props.id]);

    if (status === "complete") {
        return <CompleteCard url={url} publicDns={publicDns} />
    }

    return <LoadingStagesCards status={status} showValidation={showValidation} url={url} />
}