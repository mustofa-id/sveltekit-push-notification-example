import { browser } from '$app/environment';

export function getStorageState<T extends string | number = string>(): Record<T, string | null> {
	const state = $state(<Record<T, string | null>>{});
	if (!browser) return state;
	return new Proxy(state, {
		get(_, property: string) {
			return localStorage.getItem(property);
		},

		set(_, property: string, newValue) {
			if (newValue) {
				localStorage.setItem(property, newValue);
			} else {
				localStorage.removeItem(property);
			}
			return true;
		}
	});
}
