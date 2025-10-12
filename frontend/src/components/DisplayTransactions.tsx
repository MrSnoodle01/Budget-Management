import Transaction from './Transaction'
import type { TransactionType } from '../types/transaction';

type DisplayTransactionsProps = {
    dateSelection: string;
    transactions: TransactionType[];
    filter: string;
    onChangeTransaction: (option: TransactionType[]) => void;
}

const DisplayTransactions: React.FC<DisplayTransactionsProps> = ({ dateSelection, transactions, filter, onChangeTransaction }) => {
    const sortedData = [...transactions].sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return dateB - dateA;
    })

    return (
        <div className='transaction-display'>
            {sortedData.map((transaction) => {
                if (dateSelection === "" && filter === "All") {
                    return <Transaction key={transaction.id} onChangeTransaction={onChangeTransaction} transaction={transaction} />
                }
                let transactionDate = new Date(transaction.date);
                let transactionMonth = transactionDate.toLocaleString('default', { month: 'long' });
                let transactionYear = transactionDate.getFullYear();

                if (filter === "All") {
                    if (transactionMonth === dateSelection.split(" ")[0] && String(transactionYear) === dateSelection.split(" ")[1]) {
                        return <Transaction key={transaction.id} onChangeTransaction={onChangeTransaction} transaction={transaction} />
                    }
                } else {
                    const hasFilter = Object.values(transaction).some(value => String(value) === filter);
                    if (((transactionMonth === dateSelection.split(" ")[0] && String(transactionYear) === dateSelection.split(" ")[1]) || dateSelection === "") && hasFilter) {
                        return <Transaction key={transaction.id} onChangeTransaction={onChangeTransaction} transaction={transaction} />
                    }
                }
                return null;
            })}
        </div>
    )
}

export default DisplayTransactions;