import React from "react";
import { motion } from "framer-motion";

const Footer = () => {
    return (
        <motion.footer
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="fixed bottom-0 w-full text-center py-4 bg-white dark:bg-black shadow-md text-gray-600 text-sm"
        >
            <p className="flex items-center justify-center space-x-2">
                <span>Created by</span>
                <motion.a
                    href="https://apcodesphere.vercel.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                    whileHover={{ scale: 1.1, color: "#1D4ED8" }}
                >
                    APCodeSphere
                </motion.a>
                <span>| Inspired by</span>
                <motion.a
                    href="https://link-lite-eta.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                    whileHover={{ scale: 1.1, color: "#1D4ED8" }}
                >
                    LinkLite
                </motion.a>
            </p>
        </motion.footer>
    );
};

export default Footer;
