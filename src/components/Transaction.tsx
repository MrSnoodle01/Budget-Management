import { useEffect, useState } from 'react';

interface TransactionProps {
    id: number;
    transactionType: string;
    transactionCategory: string;
    categoryType?: string;
    subCategoryType?: string;
    amount: number;
    date: string;
}

export default function Transaction(transaction: TransactionProps) {
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
                    {transaction.amount}
                </p>
            </div>
            <div style={{ flex: "1" }}>
                <p style={{ color: "black" }}>
                    {transaction.date}
                </p>
            </div>
        </div>
    )
}