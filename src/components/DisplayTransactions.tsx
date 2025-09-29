import { tempData } from '../assets/tempData'
import Transaction from './Transaction'

export default function DisplayTransactions() {
    return (
        <div>
            {tempData.map((transaction) => (
                <Transaction key={transaction.id} {...transaction} />
            ))}
        </div>
    )
}