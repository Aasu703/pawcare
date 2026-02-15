import { createUserPet, updateUserPet, deleteUserPet } from '@/lib/api/user/pet';
export async function handleCreateUserPet(formData: PetFormData) {
  try {
    // Create FormData for file upload
    const submitData = new FormData();
    submitData.append('name', formData.name);
    submitData.append('species', formData.species);
    submitData.append('breed', formData.breed);
    submitData.append('age', formData.age.toString());
    submitData.append('weight', formData.weight.toString());

    if (formData.image && formData.image instanceof File) {
      submitData.append('image', formData.image);
    }

    const response = await createUserPet(submitData);

    if (response.success) {
      return { success: true, message: 'Pet created successfully!' };
    } else {
      return { success: false, message: response.message || 'Failed to create pet' };
    }
  } catch (error) {
    console.error('Error creating pet:', error);
    return { success: false, message: 'An error occurred while creating the pet' };
  }
}

export async function handleUpdateUserPet(petId: string, formData: PetFormData) {
  try {
    // Create FormData for file upload
    const submitData = new FormData();
    submitData.append('name', formData.name);
    submitData.append('species', formData.species);
    submitData.append('breed', formData.breed);
    submitData.append('age', formData.age.toString());
    submitData.append('weight', formData.weight.toString());

    if (formData.image && formData.image instanceof File) {
      submitData.append('image', formData.image);
    }

    const response = await updateUserPet(petId, submitData);

    if (response.success) {
      return { success: true, message: 'Pet updated successfully!' };
    } else {
      return { success: false, message: response.message || 'Failed to update pet' };
    }
  } catch (error) {
    console.error('Error updating pet:', error);
    return { success: false, message: 'An error occurred while updating the pet' };
  }
}

export async function handleDeleteUserPet(petId: string) {
  try {
    const response = await deleteUserPet(petId);

    if (response.success) {
      return { success: true, message: 'Pet deleted successfully!' };
    } else {
      return { success: false, message: response.message || 'Failed to delete pet' };
    }
  } catch (error) {
    console.error('Error deleting pet:', error);
    return { success: false, message: 'An error occurred while deleting the pet' };
  }
}
