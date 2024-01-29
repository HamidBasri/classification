"use client";

import React from "react";

const AnimatedCard = ({
  title,
  children,
}: {
  title?: string;
  children: any;
}) => {
  return (
    <div className="bg-cover bg-center h-64 bg-[url('/public/cifar_bg.png)]">
      <div className="p-4 min-w-96">
        <div className="border-2 border-gray-600 px-4 py-6 rounded-lg transform transition duration-500 hover:scale-110">
          <h2 className="title-font font-medium text-3xl text-gray-900">
            {title}
          </h2>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AnimatedCard;
