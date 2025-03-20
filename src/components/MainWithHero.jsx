import React, { useState } from "react";
import SvgIcons from "./icons/SvgIcons";
import { motion } from "framer-motion";

const Page = () => {
    const [link, setLink] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("error");
    const [shortenedLink, setShortenedLink] = useState("");
    const [iconType, setIconType] = useState("copy");

    const handleLinkChange = e => {
        setLink(e.target.value);
    };

    const handleShortenClick = async () => {
        // yh, wtf understands regex? ai :)
        const isValidLink =
            /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}(\/[^\s]*)?(\?[^\s]*)?(#[^\s]*)?$/.test(
                link
            );

        if (isValidLink) {
            setMessage("");
            setMessageType("success");
            setLoading(true);

            try {
                const response = await fetch("https://api.tinyurl.com/create", {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ url: link })
                });

                if (!response.ok) {
                    throw new Error(`Failed with status ${response.status}`);
                }

                const data = await response.json();
                setShortenedLink(data.data.tiny_url);
                setLink("");
                setMessage("Link successfully shortened!");
            } catch (error) {
                setMessage(
                    "Failed to shorten the link. Please try again. " +
                        error.message
                );
                setMessageType("error");
            } finally {
                setLoading(false);
            }
        } else {
            setMessage("Please enter a valid URL");
            setMessageType("error");
        }
    };

    const handleCopyClick = () => {
        setIconType("check");

        navigator.clipboard.writeText(shortenedLink).then(() => {
            console.log("Link copied to clipboard!");
        });
        setTimeout(() => {
            setIconType("copy");
        }, 2000);
    };
    
   // cool animations cus im learning franer motion
       const variants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };
    
    return (
        <div>
            <main className="h-[40rem] w-full dark:bg-black bg-white dark:bg-dot-white/[0.2] bg-dot-black/[0.2] relative flex items-center justify-center">
                <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
                <div className="flex text-center flex-col gap-[1.75rem] w-[315px] md:w-[500px] lg:w-[680px] -mt-[4.8rem] sm:-mt-[2.5rem]">
                    <div className="sm:mb-3">
                        <motion.a
                            href="https://github.com/TreasureUzoma/Link-Lite"
                            target="_blank"
                            initial="hidden"
                    animate="visible"
                    variants={variants}
                    transition={{ duration: 0.5 }}
                            className="border border-1 border-[#545454] text-[#525252] rounded-3xl px-5 py-2 z-40 text-[0.65rem] font-inter inline-block bg-[#fefefe] font-semibold"
                        >
                            Proudly Open Source ⚡
                        </motion.a>
                    </div>
                    <motion.h1
                        initial="hidden"
                        animate="visible"
                        transition={{ duration: 0.5, delay : 0.3 }}
                        variants={variants}
                        className="font-[900] text-[2.6rem] md:text-[3rem] z-40"
                    >
                        LinkLite.
                    </motion.h1>
                    <motion.p
                    initial="hidden"
                    animate="visible"
                    variants={variants}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="text-[1rem] text-[#717076] font-medium z-40 md:mb-3">
                        Easily transform, long, cumbersome links into concise,
                        personalized URLs that reflect your brand.
                    </motion.p>
                    <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={variants}
                    transition={{ duration: 0.5, delay: 0.9 }}
                    className="flex items-center justify-center space-x-2">
                        <input
                            type="url"
                            className="border border-1 rounded-lg w-full p-3 text-[0.8rem] font-medium focus: outline-2 focus:outline-[#474747] placeholder:text-[#909092] z-40"
                            value={link}
                            onChange={handleLinkChange}
                            placeholder="Enter Website URL"
                        />
                        <button
                            className="bg-[#474747] text-white py-3 px-4 rounded-lg text-[0.8rem] z-40"
                            onClick={handleShortenClick}
                            disabled={loading}
                        >
                            {loading ? (
                                <div className="w-3 h-3 border-2 border-t-4 border-gray-300 border-t-gray-800 rounded-full animate-spin"></div> // Spinner loader
                            ) : (
                                "Shorten"
                            )}
                        </button>
                    </motion.div>

                    {/* Show the success or error message */}
                    {message && (
                        <p
                            className={`text-[0.8rem] z-40 mt-2 ${
                                messageType === "success" ? "" : "text-red-500"
                            }`}
                        >
                            {message}
                        </p>
                    )}

                    {/* Only show this block if a shortened link exists */}
                    {shortenedLink && messageType === "success" && (
                        <div className="flex justify-center space-x-4 mt-4">
                            <p className="font-semibold text-[0.84rem]">
                                {shortenedLink}
                            </p>
                            <button onClick={handleCopyClick}>
                                <SvgIcons color="#474747" type={iconType} />
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Page;
