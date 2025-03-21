import React, { useState } from "react";

const CustomShortDomain = () => {
    const [showForm, setShowForm] = useState(false);
    const [customDomain, setCustomDomain] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("error");
    const [loading, setLoading] = useState(false);

    const hasUsedFreeDomain = localStorage.getItem("usedFreeCustomDomain");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (hasUsedFreeDomain) {
            setMessage("You have already used your free custom short domain.");
            setMessageType("error");
            return;
        }

        setLoading(true);
        setMessage("");

        const formData = new FormData();
        formData.append("custom_domain", customDomain);
        formData.append("email", email);

        try {
            const response = await fetch("https://getform.io/f/bdrnqdnb", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                setMessage("Custom domain request submitted successfully!");
                setMessageType("success");
                localStorage.setItem("usedFreeCustomDomain", "true");

                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            } else {
                throw new Error("Failed to submit the request.");
            }
        } catch (error) {
            setMessage("Something went wrong. Please try again.");
            setMessageType("error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="text-center my-6">
            {/* Move this text up by 50px */}
            <p className="text-gray-400 relative" style={{ top: '-50px' }}>
                Want a custom short domain?{" "}
                <span
                    className="text-[#FF6B00] font-bold cursor-pointer hover:underline"
                    onClick={() => setShowForm(true)}
                >
                    Click here
                </span>
            </p>

            {showForm && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-[#8A2BE2] text-white rounded-md p-6 w-full max-w-md mx-4">
                        <div className="flex justify-between items-center mb-4">
                            <p className="font-bold">
                                You can only create a custom short URL once.
                            </p>
                            <button
                                onClick={() => setShowForm(false)}
                                className="text-white hover:text-gray-300"
                            >
                                &times;
                            </button>
                        </div>

                        {hasUsedFreeDomain ? (
                            <p className="text-red-400">
                                You have already used your free custom domain.
                            </p>
                        ) : (
                            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                                <input
                                    type="text"
                                    className="p-2 text-black rounded-md"
                                    placeholder="Enter your custom domain"
                                    value={customDomain}
                                    onChange={(e) => setCustomDomain(e.target.value)}
                                    required
                                />
                                <input
                                    type="email"
                                    className="p-2 text-black rounded-md"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <button
                                    type="submit"
                                    className="bg-white text-[#8A2BE2] font-bold py-2 px-4 rounded-md"
                                    disabled={loading}
                                >
                                    {loading ? "Submitting..." : "Submit"}
                                </button>
                            </form>
                        )}

                        {message && (
                            <p className={`mt-2 ${messageType === "success" ? "text-green-300" : "text-red-300"}`}>
                                {message}
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomShortDomain;
