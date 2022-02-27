import React from "react";
import { ComponentContainer } from "./container";

import { BehaviorSubject } from "rxjs";

export const TitleBar = {
	left: new ComponentContainer(),
	center: new ComponentContainer(),
	right: new ComponentContainer()
}