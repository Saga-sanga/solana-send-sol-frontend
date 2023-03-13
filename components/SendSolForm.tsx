import { BaseSyntheticEvent, useState, FC  } from 'react'
import styles from '../styles/Home.module.css'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction, sendAndConfirmTransaction } from '@solana/web3.js';


export const SendSolForm: FC = () => {
    const [txSig, setTxSig] = useState('');
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();
    const link = () => txSig ? `https://explorer.solana.com/tx/${txSig}?cluster=devnet` : ''
    

    const sendSol = async (event: BaseSyntheticEvent) => {
        event.preventDefault();
        
        if (!connection || !publicKey) { 
            alert("Please connect your wallet first");
			return;
		}
        
        const recipient = new PublicKey(event.target.recipient.value);
        const transaction = new Transaction();

        const instruction = SystemProgram.transfer({
            fromPubkey: publicKey,
            toPubkey: recipient,
            lamports: event.target.amount.value * LAMPORTS_PER_SOL
        })

        transaction.add(instruction);

        sendTransaction(transaction, connection).then(sig => {
            setTxSig(sig);
            console.log(
                `Transaction https://explorer.solana.com/tx/${sig}?cluster=devnet`
            );
        });

        console.log(`Send ${event.target.amount.value} SOL to ${event.target.recipient.value}`);
    }

    return (
        <div>
            {
                publicKey ? 
                    <form onSubmit={sendSol} className={styles.form}>
                        <label htmlFor="amount">Amount (in SOL) to send:</label>
                        <input id="amount" type="text" className={styles.formField} placeholder="e.g. 0.1" required />
                        <br />
                        <label htmlFor="recipient">Send SOL to:</label>
                        <input id="recipient" type="text" className={styles.formField} placeholder="e.g. 4Zw1fXuYuJhWhu9KLEYMhiPEiqcpKd6akw3WRZCv84HA" required />
                        <button type="submit" className={styles.formButton}>Send</button>
                    </form> :
                    <span>Connect to your wallet</span>
            }
            {
                txSig ?
                    <div>
                        <p>View your transaction on </p>
                        <a href={link()} target='_blank'>Solana Explorer</a>
                    </div> :
                    null
            }
        </div>
    )
}