"use server";

import { success } from "zod";

export async function exampleAction(){
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return {
        success: true,
        message: "Example action completed successfully",
        data: null
    }
}
