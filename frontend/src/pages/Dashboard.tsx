import React from "react";
import { Button } from "@/components/ui/button";
import UserDropdown from "@/components/UserDropdown";
import DashboardStats from "@/components/dashboard/DashboardStats";
import DashboardLibrary from "@/components/dashboard/DashboardLibrary";
import { Link } from "react-router-dom";

const Dashboard: React.FC = () => {
    return (
        <div className="w-full h-full min-h-screen bg-[#0b0e13] text-[#fefefe] pt-10 px-3 pb-6">
            <div className="w-full max-w-[1400px] mx-auto">
                {/* Header Row */}
                <div className="flex items-center justify-between mb-8">
                    {/* LEFT: Logo + Title/Sub + HOME button */}
                    <div className="flex items-center gap-6 min-w-fit">
                        {/* Logo + Titles */}
                        <div className="flex items-center gap-3">
                            <Link to={"/"}>
                                <img src="/logo.png" alt="" className="w-16 h-16 object-contain aspect-square" />
                            </Link>
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
                        <Link to={"/"}>
                            <Button
                                variant="secondary"
                                className="rounded-lg px-6 py-2 text-base font-semibold bg-zinc-800 text-white shadow-none hover:bg-[#181d26] transition border border-[#1f2937] "
                            >
                                HOME
                            </Button>
                        </Link>
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
