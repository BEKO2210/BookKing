import { useCustomers } from "@/hooks/useCustomers";
import type { Customer } from "@/types";
import { Save, StickyNote } from "lucide-react";
import { useEffect, useState } from "react";

interface CustomerNotesProps {
	customer: Customer;
}

export function CustomerNotes({ customer }: CustomerNotesProps) {
	const { updateCustomer } = useCustomers();
	const [notes, setNotes] = useState(customer.notes ?? "");
	const [isDirty, setIsDirty] = useState(false);

	// Sync notes when switching to a different customer
	// biome-ignore lint/correctness/useExhaustiveDependencies: customer.id intentionally re-syncs state when switching to a different customer even if notes match
	useEffect(() => {
		setNotes(customer.notes ?? "");
		setIsDirty(false);
	}, [customer.id, customer.notes]);

	const handleSave = () => {
		updateCustomer.mutate({ ...customer, notes: notes || undefined });
		setIsDirty(false);
	};

	return (
		<div className="card p-4">
			<div className="flex items-center justify-between mb-3">
				<h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
					<StickyNote size={16} />
					Notizen
				</h3>
				{isDirty && (
					<button
						type="button"
						onClick={handleSave}
						className="text-xs text-primary-600 hover:text-primary-700 flex items-center gap-1"
					>
						<Save size={12} />
						Speichern
					</button>
				)}
			</div>
			<textarea
				className="input-field min-h-[80px] resize-none text-sm"
				value={notes}
				onChange={(e) => {
					setNotes(e.target.value);
					setIsDirty(true);
				}}
				onBlur={() => {
					if (isDirty) handleSave();
				}}
				placeholder="Notizen zu diesem Kunden..."
			/>
		</div>
	);
}
