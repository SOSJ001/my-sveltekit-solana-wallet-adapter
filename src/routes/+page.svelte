<script lang="ts">
	// @ts-nocheck
	import { DarkMode } from 'flowbite-svelte';
	import { walletStore } from '@svelte-on-solana/wallet-adapter-core';
	import { workSpace } from '@svelte-on-solana/wallet-adapter-ui';
	import {
		LAMPORTS_PER_SOL,
		type TransactionSignature,
		PublicKey,
		SystemProgram,
		Transaction,
		Connection
	} from '@solana/web3.js';
	import { ButtonGroup, Button } from 'flowbite-svelte';
	let balance = 0;

	// (async()=>{
	// 	balance = await connection.getBalance(publicKey, 'confirmed');
	// 			balance = balance / LAMPORTS_PER_SOL;
	// })();

	async function onClick() {
		// balance++
		// if (!$walletStore.connected) {
		// 	console.log('error', 'Wallet not connected!');
		// 	return;
		// }

		let signature: TransactionSignature = '';
		const { connection } = $workSpace;
		const publicKey = $walletStore.publicKey as PublicKey;

		// try {
		// 	signature = await connection.requestAirdrop(publicKey, LAMPORTS_PER_SOL * 2);
		// 	await connection.confirmTransaction(signature, 'confirmed');
		// 	// notificationStore.add({ type: 'success', message: 'Airdrop successful!', txid: signature });
		// 	console.log(signature);
		// 	balance = await connection.getBalance(publicKey, 'confirmed');
		// 	balance = balance / LAMPORTS_PER_SOL;
		// } catch (error: any) {
		// 	console.log('error', `Airdrop failed! ${error?.message}`, signature);
		// }

		let transaction = new Transaction();
		const recipientPubKey = new PublicKey('3ZPcjHB48wwrHmpj1pMkH3ohbEaajpTVHZJuAw4TwVzL');

		const sendSolInstruction = SystemProgram.transfer({
			fromPubkey: $walletStore.publicKey,
			toPubkey: recipientPubKey,
			lamports: LAMPORTS_PER_SOL * 0.1
		});

		transaction = transaction.add(sendSolInstruction);
		transaction.feePayer = $walletStore.publicKey; //setting the fee payer
		const { blockhash } = await connection.getRecentBlockhash(); //getting the recent block hash
		transaction.recentBlockhash = blockhash;
		const signedTransaction = await $walletStore.signTransaction(transaction); //this is to sign the transaction
		signature = await connection.sendRawTransaction(signedTransaction.serialize(), {
			skipPreflight: true,
			preflightCommitment: 'confirmed'
		}); //this is to send the transaction to the network after signing (signature is here too)
		const confirmation = await connection.confirmTransaction(signature, 'confirmed');
		// Log the transaction signature
		console.log('Transaction signature:', signature);
		console.log('Transaction confirmation:', confirmation);
	}
</script>

<DarkMode />
<div>
	{#if $walletStore.connected}
		<div class=" flex-col">
			<ButtonGroup>
				<Button on:click={onClick} outline color="yellow">Send Sol</Button>
			</ButtonGroup>
			<div class="text-white">
				Your balance is {balance}
			</div>
		</div>
	{:else}
		your wallet is not Connected
	{/if}
</div>
