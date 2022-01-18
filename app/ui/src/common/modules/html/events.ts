import React from "react";

export module HTMLEvents {


    export function get(event: React.MouseEvent) {
        if(event.target) {
            
            return event.target;
        }
    }

}