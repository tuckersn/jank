import React from "react";


export interface ChromeCSSProperties extends React.CSSProperties {
    "-webkit-user-select"?: 'none';
    "-webkit-app-region"?: 'drag';
    "-webkit-scrollbar-track"?: string;
}

