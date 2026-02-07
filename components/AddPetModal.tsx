'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { handleCreateUserPet } from '@/lib/actions/user/pet-actions';
import { PetFormData } from '@/lib/types/pet';
import { toast } from 'sonner';

const petSchema = z.object({
  name: z.string().min(1, 'Pet name is required'),
  species: z.string().min(1, 'Species is required'),
  breed: z.string().min(1, 'Breed is required'),
  age: z.number().min(0, 'Age must be positive'),
  weight: z.number().min(0, 'Weight must be positive'),
  image: z.any().optional(),
});

type PetFormValues = z.infer<typeof petSchema>;

interface AddPetModalProps {
  children: React.ReactNode;
}

export function AddPetModal({ children }: AddPetModalProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<PetFormValues>({
    resolver: zodResolver(petSchema),
    defaultValues: {
      name: '',
      species: '',
      breed: '',
      age: 0,
      weight: 0,
    },
  });

  const species = watch('species');

  const onSubmit = async (data: PetFormValues) => {
    setIsSubmitting(true);
    try {
      const formData: PetFormData = {
        name: data.name,
        species: data.species,
        breed: data.breed,
        age: data.age,
        weight: data.weight,
        image: data.image,
      };

      const result = await handleCreateUserPet(formData);

      if (result.success) {
        toast.success(result.message);
        setOpen(false);
        reset();
        router.refresh(); // Refresh the page to update pet count
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const speciesOptions = [
    { value: 'dog', label: 'Dog' },
    { value: 'cat', label: 'Cat' },
    { value: 'bird', label: 'Bird' },
    { value: 'rabbit', label: 'Rabbit' },
    { value: 'fish', label: 'Fish' },
    { value: 'other', label: 'Other' },
  ];

  const breedOptions = {
    dog: [
      'Labrador Retriever',
      'German Shepherd',
      'Golden Retriever',
      'Bulldog',
      'Poodle',
      'Beagle',
      'Rottweiler',
      'German Shorthaired Pointer',
      'Yorkshire Terrier',
      'Boxer',
      'Dachshund',
      'Siberian Husky',
      'Great Dane',
      'Chihuahua',
      'Border Collie',
      'Other',
    ],
    cat: [
      'Persian',
      'Maine Coon',
      'British Shorthair',
      'Ragdoll',
      'American Shorthair',
      'Scottish Fold',
      'Sphynx',
      'Abyssinian',
      'Birman',
      'Oriental Shorthair',
      'Siberian',
      'Norwegian Forest Cat',
      'Russian Blue',
      'Bengal',
      'Manx',
      'Other',
    ],
    bird: [
      'Budgerigar',
      'Cockatiel',
      'African Grey Parrot',
      'Canary',
      'Finch',
      'Lovebird',
      'Macaw',
      'Cockatoo',
      'Conure',
      'Parakeet',
      'Other',
    ],
    rabbit: [
      'Dutch',
      'Mini Lop',
      'Netherland Dwarf',
      'Lionhead',
      'Holland Lop',
      'Flemish Giant',
      'Rex',
      'Angora',
      'Other',
    ],
    fish: [
      'Goldfish',
      'Betta',
      'Guppy',
      'Tetra',
      'Angelfish',
      'Zebrafish',
      'Molly',
      'Platy',
      'Swordtail',
      'Other',
    ],
    other: ['Other'],
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Pet</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              {...register('name')}
              className="col-span-3"
              placeholder="Enter pet name"
            />
            {errors.name && (
              <p className="col-span-4 text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="species" className="text-right">
              Species
            </Label>
            <Select onValueChange={(value) => setValue('species', value)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select species" />
              </SelectTrigger>
              <SelectContent>
                {speciesOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.species && (
              <p className="col-span-4 text-sm text-red-500">{errors.species.message}</p>
            )}
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="breed" className="text-right">
              Breed
            </Label>
            <Select onValueChange={(value) => setValue('breed', value)} disabled={!species}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select breed" />
              </SelectTrigger>
              <SelectContent>
                {species &&
                  breedOptions[species as keyof typeof breedOptions]?.map((breed) => (
                    <SelectItem key={breed} value={breed}>
                      {breed}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            {errors.breed && (
              <p className="col-span-4 text-sm text-red-500">{errors.breed.message}</p>
            )}
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="age" className="text-right">
              Age (years)
            </Label>
            <Input
              id="age"
              type="number"
              {...register('age', { valueAsNumber: true })}
              className="col-span-3"
              placeholder="Enter age"
            />
            {errors.age && (
              <p className="col-span-4 text-sm text-red-500">{errors.age.message}</p>
            )}
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="weight" className="text-right">
              Weight (kg)
            </Label>
            <Input
              id="weight"
              type="number"
              step="0.1"
              {...register('weight', { valueAsNumber: true })}
              className="col-span-3"
              placeholder="Enter weight"
            />
            {errors.weight && (
              <p className="col-span-4 text-sm text-red-500">{errors.weight.message}</p>
            )}
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="image" className="text-right">
              Image
            </Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={(e) => setValue('image', e.target.files?.[0])}
              className="col-span-3"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Adding...' : 'Add Pet'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}