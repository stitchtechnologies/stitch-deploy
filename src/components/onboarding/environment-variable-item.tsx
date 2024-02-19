"use client";
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Code, Eye } from "lucide-react"
import { Toggle } from "@/components/ui/toggle"
import { EnvironmentVariable } from "@prisma/client";

export default function EnvironmentVariableItem({ envVar, disabled }: { envVar: EnvironmentVariable, disabled: boolean }) {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false)
    const [value, setValue] = useState<string>("")

    return (
        <div className="flex gap-4">
            <div className="font-bold flex flex-1 gap-2 items-center">
                <Code width={14} height={14} />
                <span className="font-mono text-sm">{envVar.key}</span>
            </div>
            <div className="flex gap-2 items-center flex-1 min-w-[70%]">
                <Toggle aria-label="toggle password visability" pressed={isPasswordVisible} onPressedChange={(press) => setIsPasswordVisible(press)} >
                    <Eye width={14} height={14} />
                </Toggle>
                <Input type={isPasswordVisible ? "text" : "password"} placeholder={envVar.value} disabled={disabled} value={value} onChange={(e) => setValue(e.target.value)} />
            </div>
        </div>
    )
}