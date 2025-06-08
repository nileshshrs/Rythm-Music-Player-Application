import React from "react";
import { Button } from "@/components/ui/button";
import UserDropdown from "@/components/UserDropdown";
import DashboardStats from "@/components/dashboard/DashboardStats";
import DashboardLibrary from "@/components/dashboard/DashboardLibrary";

const Dashboard: React.FC = () => {
    return (
        <div className="w-full h-full bg-[#0b0e13] text-[#fefefe] pt-10 px-6 pb-6">
            <div className="w-full max-w-[1400px] mx-auto">
                {/* Header Row */}
                <div className="flex items-center justify-between mb-8">
                    {/* LEFT: Logo + Title/Sub + HOME button */}
                    <div className="flex items-center gap-6 min-w-fit">
                        {/* Logo + Titles */}
                        <div className="flex items-center gap-3">
                            <svg
                                className="w-12 h-12"
                                viewBox="0 0 48 48"
                                fill="none"
                                aria-hidden="true"
                            >
                                <rect width="48" height="48" rx="10" fill="#14c75a" />
                                <text
                                    x="24"
                                    y="34"
                                    textAnchor="middle"
                                    fontSize="30"
                                    fontWeight="bold"
                                    fill="#111827"
                                    fontFamily="Arial, Helvetica, sans-serif"
                                >
                                    R
                                </text>
                            </svg>
                            <div className="hidden md:flex flex-col space-y-1">
                                <div className="text-2xl font-bold leading-tight tracking-tight text-[#fefefe]">
                                    Music Manager
                                </div>
                                <div className="text-[#7c8492] text-sm">
                                    Manage your music catalogue
                                </div>
                            </div>
                        </div>

                        {/* HOME Button next to title */}
                        <Button
                            variant="secondary"
                            className="rounded-lg px-6 py-2 text-base font-semibold bg-zinc-800 text-white shadow-none hover:bg-[#181d26] transition border border-[#1f2937] "
                        >
                            HOME
                        </Button>
                    </div>

                    {/* RIGHT: Avatar */}
                    <UserDropdown />
                </div>
            </div>

            <div className="mt-8">
                <DashboardStats />
            </div>
            {/* Rest of dashboard content */}
            <div className="mt-15">
                <DashboardLibrary />
            </div>
        </div>
    );
};

export default Dashboard;
