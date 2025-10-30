import Transaction from './Transaction'
import type { TransactionType } from '../types/transaction';
import type { FilterType } from '../types/filter';

type DisplayTransactionsProps = {
    dateSelection: string;
    transactions: TransactionType[];
    filter: FilterType;
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
                let noFilter = Object.values(filter).every(value => value === 'All');

                if (dateSelection === "" && noFilter) {
                    return <Transaction key={transaction.id} onChangeTransaction={onChangeTransaction} transaction={transaction} transactions={transactions} />
                }
                let transactionDate = new Date(transaction.date);
                let transactionMonth = transactionDate.toLocaleString('default', { month: 'long' });
                let transactionYear = transactionDate.getFullYear();

                if (noFilter) {
                    if (dateSelection.split(" ")[1] === undefined && String(transactionYear) === dateSelection) { // sorting by year only
                        return <Transaction key={transaction.id} onChangeTransaction={onChangeTransaction} transaction={transaction} transactions={transactions} />
                    } else if (transactionMonth === dateSelection.split(" ")[0] && String(transactionYear) === dateSelection.split(" ")[1]) {
                        return <Transaction key={transaction.id} onChangeTransaction={onChangeTransaction} transaction={transaction} transactions={transactions} />
                    }
                } else {
                    const hasFilter = (filter.transactionType === 'All' || transaction.transactionType === filter.transactionType) &&
                        (filter.transactionCategory === 'All' || transaction.transactionCategory === filter.transactionCategory) &&
                        (filter.categoryType === 'All' || transaction.categoryType === filter.categoryType) &&
                        (filter.subCategoryType === 'All' || transaction.subCategoryType === filter.subCategoryType);
                    if (dateSelection.split(" ")[1] === undefined && String(transactionYear) === dateSelection && hasFilter) { // sorting by year only
                        return <Transaction key={transaction.id} onChangeTransaction={onChangeTransaction} transaction={transaction} transactions={transactions} />
                    } else if (((transactionMonth === dateSelection.split(" ")[0] && String(transactionYear) === dateSelection.split(" ")[1]) || dateSelection === "") && hasFilter) {
                        return <Transaction key={transaction.id} onChangeTransaction={onChangeTransaction} transaction={transaction} transactions={transactions} />
                    }
                }
                return null;
            })}
        </div>
    )
}

export default DisplayTransactions;