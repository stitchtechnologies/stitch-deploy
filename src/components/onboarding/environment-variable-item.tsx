"use client";
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Code, Eye } from "lucide-react"
import { Toggle } from "@/components/ui/toggle"

export default function EnvironmentVariableItem({ disabled, environmentVariableKey, setEnvVarValue, defaultValue, value }: { disabled: boolean, environmentVariableKey: string, setEnvVarValue: (value: string) => void, defaultValue: string, value: string }) {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false)

    return (
        <div className="flex gap-4">
            <div className="font-bold flex flex-1 gap-2 items-center">
                <Code width={14} height={14} />
                <span className="font-mono text-sm">{environmentVariableKey}</span>
            </div>
            <div className="flex gap-2 items-center flex-1 min-w-[70%]">
                <Toggle aria-label="toggle password visability" pressed={isPasswordVisible} onPressedChange={(press) => setIsPasswordVisible(press)} >
                    <Eye width={14} height={14} />
                </Toggle>
                <Input type={isPasswordVisible ? "text" : "password"} placeholder={defaultValue} disabled={disabled} value={value} onChange={(e) => setEnvVarValue(e.target.value)} />
            </div>
        </div>
    )
}