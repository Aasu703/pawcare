"use server";

import { mapApiResult, withActionGuard } from "@/lib/actions/_shared";
import { createUserPet, updateUserPet, deleteUserPet } from "@/lib/api/user/pet";

type PetPayload = {
  name: string;
  species: string;
  breed: string;
  age: number;
  weight: number;
  image?: File | null;
};

const toPetFormData = (payload: PetPayload): FormData => {
  const submitData = new FormData();
  submitData.append("name", payload.name);
  submitData.append("species", payload.species);
  submitData.append("breed", payload.breed);
  submitData.append("age", payload.age.toString());
  submitData.append("weight", payload.weight.toString());

  // Send image only when a valid file object is provided.
  if (payload.image instanceof File) {
    submitData.append("image", payload.image);
  }

  return submitData;
};

export async function handleCreateUserPet(formData: PetPayload) {
  return withActionGuard(async () => {
    const response = await createUserPet(toPetFormData(formData));

    return mapApiResult(response, {
      errorMessage: "Failed to create pet",
      successMessage: "Pet created successfully!",
    });
  }, {
    fallbackMessage: "An error occurred while creating the pet",
    logLabel: "Create pet error",
  });
}

export async function handleUpdateUserPet(petId: string, formData: PetPayload) {
  return withActionGuard(async () => {
    const response = await updateUserPet(petId, toPetFormData(formData));

    return mapApiResult(response, {
      errorMessage: "Failed to update pet",
      successMessage: "Pet updated successfully!",
    });
  }, {
    fallbackMessage: "An error occurred while updating the pet",
    logLabel: "Update pet error",
  });
}

export async function handleDeleteUserPet(petId: string) {
  return withActionGuard(async () => {
    const response = await deleteUserPet(petId);

    return mapApiResult(response, {
      errorMessage: "Failed to delete pet",
      successMessage: "Pet deleted successfully!",
    });
  }, {
    fallbackMessage: "An error occurred while deleting the pet",
    logLabel: "Delete pet error",
  });
}
