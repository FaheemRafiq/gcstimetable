import { useEffect, useState } from "react";
import { Link } from "@inertiajs/react";
import { ArrowUpRight } from "lucide-react";
import Tooltip from "@/components/ui/tooltip";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

export default function SimpleStats({
    title,
    value,
    navigation,
    icon: Icon,
}: {
    title: string;
    value: number;
    navigation?: string;
    icon?: React.ElementType;
}) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let start = 0;
        const increment = Math.ceil(value / 50); // Adjust increment speed here
        const interval = setInterval(() => {
            start += increment;
            if (start >= value) {
                setCount(value);
                clearInterval(interval);
            } else {
                setCount(start);
            }
        }, 20); // Adjust interval time here
        return () => clearInterval(interval);
    }, [value]);

    return (
        <Card className="relative">
            <CardHeader className="flex flex-col items-center text-center">
                <div className="w-12 h-12 flex items-center justify-center bg-primary/20 text-primary rounded-full">
                    {Icon && <Icon className="w-6 h-6" />}
                </div>
                <CardTitle className="mt-4 text-sm font-medium text-muted-foreground">
                    {title}
                </CardTitle>
                <CardDescription className="mt-2 text-4xl font-extrabold text-primary">
                    {count}
                </CardDescription>
            </CardHeader>
            {navigation && (
                <CardFooter className="absolute top-4 right-4">
                    <Tooltip title="Show All">
                        <div className="text-primary hover:opacity-80">
                            <Link href={navigation}>
                                <ArrowUpRight className="w-5 h-5" />
                            </Link>
                        </div>
                    </Tooltip>
                </CardFooter>
            )}
        </Card>
    );
}
