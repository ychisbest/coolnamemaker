import { useState, useEffect } from 'react';

const NameGenerator = () => {
    const [prompt, setPrompt] = useState('');
    const [names, setNames] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(null);
    const [animateIn, setAnimateIn] = useState(false);

    useEffect(() => {
        setAnimateIn(true);
    }, []);

    useEffect(() => {
        if (copied !== null) {
            const timer = setTimeout(() => {
                setCopied(null);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [copied]);

    const generateNames = async () => {
        if (!prompt.trim()) {
            setError('Please enter a description for the name you want to generate');
            return;
        }

        setLoading(true);
        setError('');
        
        try {
            const response = await fetch('https://ai.ych.show', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ych', 
                },
                body: JSON.stringify({
                    model: "random",
                    messages: [
                        {
                            role: "system", 
                            content: "You are a creative name generator. Generate 5 unique and catchy names based on the description provided. Return only the names as a numbered list without any additional text."
                        },
                        {
                            role: "user", 
                            content: prompt
                        }
                    ],
                    temperature: 0.9,
                    max_tokens: 150
                }),
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to generate names');
            }

            const content = data.choices[0].message.content;
            const namesList = content.split('\n')
                .map(line => line.trim())
                .filter(line => line && /^\d+\.?\s+/.test(line))
                .map(line => line.replace(/^\d+\.?\s+/, '').trim());

            setNames(namesList.length > 0 ? namesList : ['No valid names were generated']);
        } catch (err) {
            console.error('Error generating names:', err);
            setError('Failed to generate names. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (text, index) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopied(index);
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    };

    const copyAllNames = () => {
        if (names.length > 0) {
            navigator.clipboard.writeText(names.join('\n')).then(() => {
                setCopied('all');
            }).catch(err => {
                console.error('Failed to copy all names: ', err);
            });
        }
    };

    return (
        <div className={` mx-auto p-8 mb-10 bg-white rounded-xl shadow-sm border border-gray-200 transition-all duration-700 ease-in-out ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="mb-8 transition-all duration-500 ease-in-out transform hover:translate-x-1">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Name Generator</h1>
                <p className="text-gray-500 text-sm">Generate creative names using AI</p>
            </div>

            <div className="mb-6 transition-all duration-300 ease-in-out">
                <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">
                    What kind of name do you need?
                </label>
                <div className="relative">
                    <textarea
                        id="prompt"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="e.g. A tech startup focused on AI-powered healthcare solutions"
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 min-h-[120px] text-gray-800 transition-all duration-200 hover:border-gray-300"
                    />
                </div>
            </div>

            <button
                onClick={generateNames}
                disabled={loading}
                className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center disabled:bg-gray-400 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
            >
                {loading ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Generating...
                    </>
                ) : (
                    'Generate Names'
                )}
            </button>

            {error && (
                <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-md border border-red-100 animate-fadeIn">
                    {error}
                </div>
            )}

            {names.length > 0 && (
                <div className="mt-8 transition-all duration-500 ease-in-out">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-800">Generated Names</h2>
                        <button 
                            onClick={copyAllNames} 
                            className="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200 flex items-center px-2 py-1 rounded hover:bg-gray-100"
                        >
                            {copied === 'all' ? (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    Copied all
                                </>
                            ) : (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                    Copy all
                                </>
                            )}
                        </button>
                    </div>
                    <div className="space-y-2">
                        {names.map((name, index) => (
                            <div 
                                key={index} 
                                className={`p-4 bg-gray-50 rounded-md border border-gray-200 hover:border-gray-300 transition-all duration-200 flex justify-between items-center group animate-fadeIn`}
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <p className="text-gray-800 font-medium">{name}</p>
                                <button 
                                    onClick={() => copyToClipboard(name, index)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1 rounded hover:bg-gray-200 opacity-0 group-hover:opacity-100"
                                    aria-label="Copy to clipboard"
                                >
                                    {copied === index ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="mt-12 text-center text-sm text-gray-400 transition-opacity duration-200 hover:text-gray-500">
                <p>Powered by AI • Made with ♥</p>
            </div>
        </div>
    );
};

export default NameGenerator;