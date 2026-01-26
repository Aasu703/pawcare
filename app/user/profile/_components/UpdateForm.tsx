"use clinet";

import { useState } from "react";

export default function UpdateForm(
    {user}: {user:any}
) {
    return (
        <div>
            {user.email}
        </div>
    )
}