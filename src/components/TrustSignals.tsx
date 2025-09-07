import React from 'react';
import { Shield, Award, Clock, Star } from 'lucide-react';

export const TrustSignals: React.FC = () => {
  return (
    <section className="py-16 bg-white border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 bg-black rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-sm font-medium text-black mb-2">100% Verified</h3>
            <p className="text-xs text-gray-600">All profiles verified & authentic photos guaranteed</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 bg-black rounded-full flex items-center justify-center">
              <Award className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-sm font-medium text-black mb-2">Premium Service</h3>
            <p className="text-xs text-gray-600">Established agency with reputation for excellence</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 bg-black rounded-full flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-sm font-medium text-black mb-2">24/7 Available</h3>
            <p className="text-xs text-gray-600">Round-the-clock booking & support service</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 bg-black rounded-full flex items-center justify-center">
              <Star className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-sm font-medium text-black mb-2">Elite Standards</h3>
            <p className="text-xs text-gray-600">Handpicked selection of sophisticated companions</p>
          </div>
        </div>
        
        {/* Client Testimonial */}
        <div className="mt-16 max-w-3xl mx-auto text-center">
          <blockquote className="text-lg italic text-gray-600 mb-4">
            "Your discretion is guaranteed. Your enjoyment is assured. Live life to the full - and enjoy a Five London companion tonight."
          </blockquote>
          <p className="text-sm text-gray-500">~ Five London Team ~</p>
        </div>
      </div>
    </section>
  );
};