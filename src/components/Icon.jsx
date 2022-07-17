import React from "react";

export default function Icon({link, icon, name}) {
  return (
    <a href={link} target="_blank" rel="noopener noreferrer">
      <img className="icon" src={icon} alt={name} />
    </a>
  );
}