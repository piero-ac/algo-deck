import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function SearchProblemsInput({
	input,
	onChange,
}: {
	input: string;
	onChange: (text: string) => void;
}) {
	return (
		<Field>
			<Input
				id="input-field-search"
				type="text"
				placeholder="Begin typing to search problems...."
				value={input}
				onChange={(e) => onChange(e.target.value)}
			/>
		</Field>
	);
}
