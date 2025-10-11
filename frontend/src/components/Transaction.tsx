import { useEffect, useState } from 'react';

type TransactionType = {
    id: number;
    transactionType: string;
    transactionCategory?: string;
    categoryType?: string;
    subCategoryType?: string;
    amount: number;
    date: string;
}

type TransactionProps = {
    transaction: TransactionType;
    onChangeTransaction: (option: TransactionType[]) => void;
}

const Transaction: React.FC<TransactionProps> = ({ transaction, onChangeTransaction }) => {
    const [backgroundColor, setBackgroundColor] = useState('')

    useEffect(() => {
        switch (transaction.transactionType) {
            case "Income":
                setBackgroundColor('#91ff83ff');
                break;
            case "Expense":
                setBackgroundColor('#ff7676ff');
                break;
            default:
                setBackgroundColor('#d4d235ff');
                break;
        }
    }, [])

    function deleteTransaction() {
        fetch(`/api/deleteTransaction/3?transactionId=${transaction.id}`, {
            method: 'DELETE',
        }).then(res => {
            if (!res.ok) {
                throw new Error(`HTTP error, status: ${res.status}`);
            }
            return res.json();
        }).then(updatedUser => {
            onChangeTransaction(updatedUser.transactions);
        })
    }

    return (
        <div key={transaction.id} className="transaction" style={{ background: backgroundColor }}>
            <div style={{ flex: "1" }}>
                <p style={{ color: "black" }}>
                    {transaction.transactionType}
                </p>
            </div>
            <div style={{ flex: "1" }}>
                <p style={{ color: "black" }}>
                    {transaction.transactionCategory}
                </p>
            </div>
            <div style={{ flex: "1" }}>
                <p style={{ color: "black" }}>
                    {transaction.categoryType}
                </p>
            </div>
            <div style={{ flex: "1" }}>
                <p style={{ color: "black" }}>
                    {transaction.subCategoryType}
                </p>
            </div>
            <div style={{ flex: "1" }}>
                <p style={{ color: "black" }}>
                    ${transaction.amount.toFixed(2)}
                </p>
            </div>
            <div style={{ flex: "1" }}>
                <p style={{ color: "black" }}>
                    {transaction.date}
                </p>
            </div>
            <div style={{ display: "flex", gap: "2.5px", flexDirection: "column" }}>
                <button>edit</button>
                <button onClick={deleteTransaction}>delete</button>
            </div>
        </div>
    )
}

export default Transaction;