<script lang="ts">

	import '../app.pcss';

	import { onMount } from 'svelte';
	import * as web3 from '@solana/web3.js';
	import {
		workSpace,
		WalletProvider,
		WalletMultiButton,
		ConnectionProvider
	} from '@svelte-on-solana/wallet-adapter-ui';

	const localStorageKey = 'walletAdapter';
	const network = web3.clusterApiUrl('devnet'); // localhost or mainnet

	let wallets;

	onMount(async () => {
		const {
		PhantomWalletAdapter,
		// SlopeWalletAdapter,
		SolflareWalletAdapter,
		// SolletExtensionWalletAdapter,
		TorusWalletAdapter,
		} = await import('@solana/wallet-adapter-wallets');

		const walletsMap = [
			new PhantomWalletAdapter(),
			// new SlopeWalletAdapter(),
			new SolflareWalletAdapter(),
			// new SolletExtensionWalletAdapter(),
			new TorusWalletAdapter(),
		];

		wallets = walletsMap;
	});
</script>

<WalletProvider {localStorageKey} {wallets} autoConnect />
<ConnectionProvider {network} />
<div class="flex w-screen justify-center items-center">
	<div class="text-center space-x-5 space-y-5">
		<WalletMultiButton />
	<slot />
	</div>
</div>
