import { useEffect, useState } from 'react';
import EditModal from './EditModal'
import type { TransactionType } from '../types/transaction';

type TransactionProps = {
    transaction: TransactionType;
    onChangeTransaction: (option: TransactionType[]) => void;
    transactions: TransactionType[];
}

const Transaction: React.FC<TransactionProps> = ({ transaction, onChangeTransaction, transactions }) => {
    const [backgroundColor, setBackgroundColor] = useState('')
    const [showEdit, setShowEdit] = useState(false)

    const token = localStorage.getItem("token");
    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        switch (transaction.transactionType) {
            case "Income":
                setBackgroundColor('#82ff71ff');
                break;
            case "Expense":
                setBackgroundColor('#FF6B6B');
                break;
            default:
                setBackgroundColor('#FFE66D');
                break;
        }
    }, [])

    function deleteTransaction() {
        fetch(API_URL + `/api/deleteTransaction?transactionId=${transaction.id}`, {
            method: 'DELETE',
            headers: {
                "Authorization": `Bearer ${token}`,
            },
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
            <div style={{ display: "flex", flexDirection: "column", flex: "1" }}>
                <button onClick={() => setShowEdit(true)} className="edit-delete-buttons">Edit</button>
                <button onClick={deleteTransaction} className="edit-delete-buttons">Delete</button>
            </div>
            <EditModal isOpen={showEdit} onClose={() => setShowEdit(false)} editedTransaction={transaction} onChangeTransaction={onChangeTransaction} transactions={transactions} />
        </div>
    )
}

export default Transaction;