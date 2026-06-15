import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";

interface Props {
	children: ReactNode;
	fallback?: ReactNode;
}

interface State {
	hasError: boolean;
	error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = { hasError: false, error: null };
	}

	static getDerivedStateFromError(error: Error): State {
		return { hasError: true, error };
	}

	componentDidCatch(error: Error, info: ErrorInfo) {
		console.error("ErrorBoundary caught:", error, info.componentStack);
	}

	render() {
		if (this.state.hasError) {
			if (this.props.fallback) return this.props.fallback;

			return (
				<div className="p-6 text-center">
					<div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-50 mb-4">
						<svg
							width="24"
							height="24"
							fill="none"
							stroke="#ef4444"
							strokeWidth="2"
							viewBox="0 0 24 24"
							aria-hidden="true"
						>
							<circle cx="12" cy="12" r="10" />
							<line x1="12" y1="8" x2="12" y2="12" />
							<line x1="12" y1="16" x2="12.01" y2="16" />
						</svg>
					</div>
					<h3 className="text-lg font-semibold text-gray-900 mb-2">
						Etwas ist schiefgelaufen
					</h3>
					<p className="text-sm text-gray-500 mb-4">
						{this.state.error?.message}
					</p>
					<button
						type="button"
						onClick={() => {
							this.setState({ hasError: false, error: null });
							window.location.reload();
						}}
						className="btn-primary text-sm"
					>
						Seite neu laden
					</button>
				</div>
			);
		}

		return this.props.children;
	}
}
