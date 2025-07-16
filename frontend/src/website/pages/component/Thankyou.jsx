import React from 'react';
import { CheckCircle } from 'lucide-react';

const ThankYouPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
            <div className="bg-white rounded-2xl shadow-xl p-12 max-w-2xl mx-4 text-center border border-gray-100">
                {/* Success Icon */}
                <div className="mb-8">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>
                </div>

                {/* Thank You Text */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">
                        Thank You
                    </h1>
                    <div className="w-24 h-1 bg-[#e85920] mx-auto mb-6"></div>
                    <p className="text-lg text-gray-600 leading-relaxed mb-4">
                        Your message has been successfully received and is being processed by our team.
                    </p>
                    <p className="text-gray-500 mb-6">
                        We appreciate your interest and will respond to your inquiry within 24-48 hours during business days.
                    </p>
                </div>

                {/* Additional Information */}
                {/* <div className="bg-gray-50 rounded-lg p-6 mb-8">
                    <h2 className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                        What happens next?
                    </h2>
                    <p className="text-sm text-gray-600">
                        Our team will review your message and provide a comprehensive response. 
                        If your inquiry is urgent, please contact us directly through our support channels.
                    </p>
                </div> */}

                {/* Action Button */}
                <button
                    className="bg-[#e85920] text-white font-semibold py-3 px-8 rounded-lg hover:bg-[#e85920] transition duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    onClick={() => window.location.href = '/'}
                >
                    Return to Homepage
                </button>

                {/* Footer */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                    <p className="text-xs text-gray-400">
                        {/* Message submitted successfully • Reference ID: {Math.random().toString(36).substr(2, 9).toUpperCase()} */}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ThankYouPage;