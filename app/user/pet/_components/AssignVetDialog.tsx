"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface VerifiedVetOption {
  _id: string;
  name?: string;
  clinicOrShopName?: string;
}

interface AssignVetDialogProps {
  isOpen: boolean;
  petName: string | undefined;
  selectedVetId: string;
  verifiedVets: VerifiedVetOption[];
  loadingVets: boolean;
  assigningVet: boolean;
  onClose: () => void;
  onVetChange: (vetId: string) => void;
  onSave: () => void;
}

export function AssignVetDialog({
  isOpen,
  petName,
  selectedVetId,
  verifiedVets,
  loadingVets,
  assigningVet,
  onClose,
  onVetChange,
  onSave,
}: AssignVetDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => (!open ? onClose() : null)}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Assign Verified Vet</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Assign a PawCare-verified vet for {petName}. The selected vet can review assigned pets one by one.
          </p>

          <Select value={selectedVetId} onValueChange={onVetChange}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a verified vet" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="unassigned">No vet assigned</SelectItem>
              {verifiedVets.map((vet) => (
                <SelectItem key={vet._id} value={vet._id}>
                  {vet.clinicOrShopName || vet.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {loadingVets && <p className="text-xs text-muted-foreground">Loading verified vets...</p>}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-border text-foreground hover:bg-muted"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onSave}
              disabled={assigningVet}
              className="px-4 py-2 rounded-lg bg-amber-500 text-white hover:bg-amber-600 disabled:opacity-60"
            >
              {assigningVet ? 'Saving...' : 'Save Assignment'}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
