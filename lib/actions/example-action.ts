"use server";

// Minimal server action example used by demo pages.
export async function exampleAction() {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return {
        success: true,
        message: "Example action completed successfully",
        data: null,
    };
}
