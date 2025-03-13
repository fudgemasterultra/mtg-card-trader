<script lang="ts">
	import { goto } from '$app/navigation';
	let email = $state('');
	let password = $state('');
	let loading = $state(false);
	let success = $state(false);

	async function handleSubmit(event: Event) {
		event.preventDefault();
		loading = true;
		try {
			const response = await fetch('/api/auth/login', {
				method: 'POST',
				body: JSON.stringify({ email, password })
			});
			const data = await response.json();
			if (!response.ok) {
				alert(data.error);
				loading = false;
				return;
			}
			success = true;
			goto('/dashboard');
		} catch (error) {
			console.error(error);
		}
	}
</script>

<div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
	<div class="sm:mx-auto sm:w-full sm:max-w-sm">
		<img
			class="mx-auto h-10 w-auto"
			src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
			alt="Your Company"
		/>
		<h2 class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
			Sign in to your account
		</h2>
	</div>

	<div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
		<form class="space-y-6" onsubmit={handleSubmit}>
			<div>
				<label for="email" class="block text-sm/6 font-medium text-gray-900">Email address</label>
				<div class="mt-2">
					<input
						type="email"
						name="email"
						id="email"
						bind:value={email}
						autocomplete="email"
						required
						class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
					/>
				</div>
			</div>

			<div>
				<div class="flex items-center justify-between">
					<label for="password" class="block text-sm/6 font-medium text-gray-900">Password</label>
				</div>
				<div class="mt-2">
					<input
						type="password"
						name="password"
						bind:value={password}
						id="password"
						autocomplete="current-password"
						required
						class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
					/>
				</div>
			</div>
			<div>
				<button
					type="submit"
					class={`flex w-full justify-center rounded-md px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 ${loading ? 'bg-gray-600 hover:bg-gray-500 focus-visible:outline-gray-600' : 'bg-indigo-600 hover:bg-indigo-500 focus-visible:outline-indigo-600'}`}
					disabled={loading}>{loading ? 'Loading...' : 'Sign in'}</button
				>
			</div>
		</form>
	</div>
</div>
