import Transaction from './Transaction'

type DisplayTransactionsProps = {
    dateSelection: string;
    transactions: TransactionType[];
}

type TransactionType = {
    id: number;
    transactionType: string;
    transactionCategory?: string;
    categoryType?: string;
    subCategoryType?: string;
    amount: number;
    date: string;
}

const DisplayTransactions: React.FC<DisplayTransactionsProps> = ({ dateSelection, transactions }) => {
    const sortedData = [...transactions].sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return dateB - dateA;
    })

    return (
        <div className='transaction-display'>
            {sortedData.map((transaction) => {
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