import { tempData } from '../assets/tempData'
import Transaction from './Transaction'

type DisplayTransactionsProps = {
    dateSelection: string;
}

const DisplayTransactions: React.FC<DisplayTransactionsProps> = ({ dateSelection }) => {
    return (
        <div className='transaction-display'>
            {tempData.map((transaction) => {
                if (dateSelection === "") {
                    return <Transaction key={transaction.id} {...transaction} />
                }
                let transactionDate = new Date(transaction.date);
                let transactionMonth = transactionDate.toLocaleString('default', { month: 'long' });
                let transactionYear = transactionDate.getFullYear();


                if (transactionMonth === dateSelection.split(" ")[0] && String(transactionYear) === dateSelection.split(" ")[1]) {
                    return <Transaction key={transaction.id} {...transaction} />
                }
                return null;
            })}
        </div>
    )
}

export default DisplayTransactions;