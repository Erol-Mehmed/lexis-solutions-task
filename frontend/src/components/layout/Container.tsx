import React from "react";

export default function Container({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
})  {
  return (
    <div className={`container-xxl px-3 px-sm-4 px-lg-5 ${className}`}>
      {children}
    </div>
  );
}
