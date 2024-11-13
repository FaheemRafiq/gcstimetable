import React from "react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link } from "@inertiajs/react";
import { useBreadcrumb } from "@/components/providers/breadcrum-provider";

export function PageBreadcrums() {
    const { breadcrumb } = useBreadcrumb();

    return (
        <Breadcrumb>
            <BreadcrumbList>
                {breadcrumb && (
                    <React.Fragment>
                        {breadcrumb.backItems &&
                            breadcrumb.backItems.length > 0 &&
                            breadcrumb.backItems.map(
                                (
                                    backItem: { title: string; url: string },
                                    index: number
                                ) => (
                                    <React.Fragment key={index}>
                                        <BreadcrumbItem className="hidden md:block">
                                            <BreadcrumbLink href={"#"} asChild>
                                                <Link href={backItem.url}>
                                                    {backItem.title}
                                                </Link>
                                            </BreadcrumbLink>
                                        </BreadcrumbItem>
                                        <BreadcrumbSeparator className="hidden md:block" />
                                    </React.Fragment>
                                )
                            )}
                        <BreadcrumbItem>
                            <BreadcrumbLink href="#">
                                {breadcrumb.title}
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                    </React.Fragment>
                )}
            </BreadcrumbList>
        </Breadcrumb>
    );
}
