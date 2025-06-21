import clsx from "clsx";
import React from "react";

const featuredSongs = [
    "Foo Fighters Everlong",
    "Billie Eilish Happier Than Ever",
    "Arctic Monkeys Do I Wanna Know?",
    "Dua Lipa Levitating",
    "The Killers Mr. Brightside",
    "Harry Styles As It Was",
];

const categories = [
    {
        title: "Pop",
        color: "bg-[#8c4dc4]",
        image: "/pop.webp",
    },
    {
        title: "Rock",
        color: "bg-[#bb4508]",
        image: "/rock.webp",
    },
];

const CARD_HEIGHT = 250;

const BrowseCards = () => {
    return (
        <div className="w-full mb-8 pt-8">
            {/* Desktop Grid Layout: 1200px+ */}
            <div className="hidden xl:grid grid-cols-3 grid-rows-[auto,1fr] gap-x-8 gap-y-6 w-full items-start"
                style={{ minHeight: `${CARD_HEIGHT + 36}px` }}>
                <div className="row-span-2">
                    <div
                        className={clsx(
                            "rounded-sm px-6 py-8 flex flex-col justify-between bg-gradient-to-br from-[#4e32a8] via-[#6772dc] to-[#6fd0ff] shadow text-white h-full"
                        )}
                        style={{
                            minHeight: CARD_HEIGHT,
                            height: CARD_HEIGHT + 50,
                        }}
                    >
                        <div
                            className="text-[15px] py-5 leading-snug opacity-95 mb-4"
                            style={{
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                            }}
                        >
                            {featuredSongs.slice(0, 6).join(" · ")} ...
                        </div>
                        <div>
                            <div className="font-extrabold text-2xl mb-1">Featured Songs</div>
                            <div className="text-base font-semibold opacity-85">
                                Hand-picked for you
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-span-2 flex items-center pl-1">
                    <h1 className="font-bold text-xl text-white">Browse all</h1>
                </div>
                {categories.map((cat) => (
                    <div
                        key={cat.title}
                        className={clsx(
                            "relative rounded-sm p-6 flex flex-col justify-start font-extrabold text-2xl text-white shadow overflow-hidden h-full",
                            cat.color
                        )}
                        style={{
                            minHeight: CARD_HEIGHT,
                            height: CARD_HEIGHT,
                        }}
                    >
                        <div className="mb-auto">{cat.title}</div>
                        {cat.image && (
                            <img
                                src={cat.image}
                                alt={cat.title}
                                className="absolute right-[-14px] bottom-[-14px] w-50 h-50 object-cover rounded-lg rotate-[20deg] pointer-events-none"
                                draggable={false}
                            />
                        )}
                    </div>
                ))}
            </div>

            {/* Tablet Layout: 768px–1199px */}
            <div className="hidden md:flex xl:hidden flex-col w-full">
                <div
                    className={clsx(
                        "rounded-sm px-6 py-8 mb-6 flex flex-col justify-between bg-gradient-to-br from-[#4e32a8] via-[#6772dc] to-[#6fd0ff] shadow text-white w-full"
                    )}
                    style={{
                        minHeight: CARD_HEIGHT,
                        height: CARD_HEIGHT + 50,
                    }}
                >
                    <div
                        className="text-[15px] py-5 leading-snug opacity-95 mb-4"
                        style={{
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                        }}
                    >
                        {featuredSongs.slice(0, 6).join(" · ")} ...
                    </div>
                    <div>
                        <div className="font-extrabold text-2xl mb-1">Featured Songs</div>
                        <div className="text-base font-semibold opacity-85">
                            Hand-picked for you
                        </div>
                    </div>
                </div>
                <div className="pl-1 mb-4">
                    <h1 className="font-bold text-xl text-white">Browse all</h1>
                </div>
                <div className="flex gap-6 w-full flex-wrap">
                    {categories.map((cat) => (
                        <div
                            key={cat.title}
                            className={clsx(
                                "flex-1 min-w-[200px] relative rounded-sm p-6 flex flex-col justify-start font-extrabold text-2xl text-white shadow overflow-hidden",
                                cat.color
                            )}
                            style={{
                                minHeight: CARD_HEIGHT,
                                height: CARD_HEIGHT,
                            }}
                        >
                            <div className="mb-auto">{cat.title}</div>
                            {cat.image && (
                                <img
                                    src={cat.image}
                                    alt={cat.title}
                                    className="absolute right-[-14px] bottom-[-14px] w-50 h-50 object-cover rounded-lg rotate-[20deg] pointer-events-none"
                                    draggable={false}
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Mobile Layout: below 768px */}
            <div className="block md:hidden w-full">
                <div
                    className={clsx(
                        "rounded-sm px-6 py-8 mb-6 flex flex-col justify-between bg-gradient-to-br from-[#4e32a8] via-[#6772dc] to-[#6fd0ff] shadow text-white w-full"
                    )}
                    style={{
                        minHeight: CARD_HEIGHT,
                        height: CARD_HEIGHT + 50,
                    }}
                >
                    <div
                        className="text-[15px] py-5 leading-snug opacity-95 mb-4"
                        style={{
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                        }}
                    >
                        {featuredSongs.slice(0, 6).join(" · ")} ...
                    </div>
                    <div>
                        <div className="font-extrabold text-2xl mb-1">Featured Songs</div>
                        <div className="text-base font-semibold opacity-85">
                            Hand-picked for you
                        </div>
                    </div>
                </div>
                <div className="pl-1 mb-4">
                    <h1 className="font-bold text-xl text-white">Browse all</h1>
                </div>
                <div className="flex flex-col gap-6 w-full">
                    {categories.map((cat) => (
                        <div
                            key={cat.title}
                            className={clsx(
                                "w-full relative rounded-sm p-6 flex flex-col justify-start font-extrabold text-2xl text-white shadow overflow-hidden",
                                cat.color
                            )}
                            style={{
                                minHeight: CARD_HEIGHT,
                                height: CARD_HEIGHT,
                            }}
                        >
                            <div className="mb-auto">{cat.title}</div>
                            {cat.image && (
                                <img
                                    src={cat.image}
                                    alt={cat.title}
                                    className="absolute right-[-14px] bottom-[-14px] w-50 h-50 object-cover rounded-lg rotate-[20deg] pointer-events-none"
                                    draggable={false}
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BrowseCards;
