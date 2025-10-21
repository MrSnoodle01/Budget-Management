import { useState, useEffect } from "react"
import type { TransactionType } from '../types/transaction';

type MoneyInputProps = {
    onChangeTransaction?: (option: TransactionType[]) => void;
    isEditing?: boolean;
    editedTransaction?: TransactionType;
}

const MoneyInput: React.FC<MoneyInputProps> = ({ onChangeTransaction, isEditing = false, editedTransaction = null }) => {
    const [selectColor, setSelectColor] = useState('#6d6d6dff');
    const [transactionType, setTransactionType] = useState('');
    const [transactionCategory, setTransactionCategory] = useState('');
    const [categoryType, setCategoryType] = useState('');
    const [subCategoryType, setSubCategoryType] = useState('');
    const [amount, setAmount] = useState(0);
    const [date, setDate] = useState("");

    useEffect(() => {
        if (editedTransaction) {
            setTransactionType(editedTransaction.transactionType);
            setTransactionCategory(editedTransaction.transactionCategory ?? '');
            setCategoryType(editedTransaction.categoryType ?? '');
            setSubCategoryType(editedTransaction.subCategoryType ?? '');
            setAmount(editedTransaction.amount);
            setDate(editedTransaction.date);

            if (editedTransaction.transactionType === "Income") {
                setSelectColor('#91ff83ff');
            } else if (editedTransaction.transactionType === "Expense") {
                setSelectColor('#ff7676ff');
            } else {
                setSelectColor('#d4d235ff');
            }
        }
    }, [editedTransaction]);

    function handleTransactionTypeChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const value = e.target.value;
        setTransactionType(value);
        if (value === "Income") {
            setSelectColor('#91ff83ff');
        } else if (value === "Expense") {
            setSelectColor('#ff7676ff');
        } else {
            setSelectColor('#d4d235ff');
        }
    }

    function handleDateChange(e: React.ChangeEvent<HTMLInputElement>) {
        let newDate = new Date(e.target.value + "T00:00:00");
        const options: Intl.DateTimeFormatOptions = {
            year: "2-digit",
            month: 'numeric',
            day: 'numeric',
        }
        setDate(newDate.toLocaleDateString('en-US', options))
    }

    function options() {
        switch (transactionType) {
            case 'Income':
                return (
                    <input
                        style={{ background: selectColor, color: 'black' }}
                        onChange={e => setTransactionCategory(e.target.value)}
                        value={transactionCategory}
                        placeholder={'Category of income'}
                    />
                );
            case 'Expense':
                return (
                    <>
                        <input
                            style={{ background: selectColor, color: 'black' }}
                            onChange={e => setTransactionCategory(e.target.value)}
                            value={transactionCategory}
                            placeholder='Category of expense'
                        />
                        <input
                            style={{ background: selectColor, color: 'black' }}
                            onChange={e => setCategoryType(e.target.value)}
                            value={categoryType}
                            placeholder='Category type'
                        />
                        <input
                            style={{ background: selectColor, color: 'black' }}
                            onChange={e => setSubCategoryType(e.target.value)}
                            value={subCategoryType}
                            placeholder='Sub-category type'
                        />
                    </>
                );
            default:
                return null;
        }
    }

    function addTransaction() {
        let dateId = new Date()
        fetch('/api/addTransaction/1', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "transactions": [{
                    id: dateId.getTime(),
                    transactionType: transactionType,
                    transactionCategory: transactionCategory,
                    categoryType: categoryType,
                    subCategoryType: subCategoryType,
                    amount: amount,
                    date: date,
                }]
            })
        }).then(res => {
            if (!res.ok) {
                throw new Error(`HTTP error, status: ${res.status}`);
            }
            return res.json();
        }).then(updatedUser => {
            if (onChangeTransaction) {
                onChangeTransaction(updatedUser.transactions);
            }
        }).catch(error => {
            console.error("Error updating resource: ", error);
        })
    }

    function editTransaction() {
        if (!editedTransaction) return;

        fetch(`/api/editTransaction/1?transactionId=${editedTransaction.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: editedTransaction.id,
                transactionType: transactionType,
                transactionCategory: transactionCategory,
                categoryType: categoryType,
                subCategoryType: subCategoryType,
                amount: amount,
                date: date,
            })
        }).then(res => {
            if (!res.ok) {
                throw new Error(`HTTP error, status: ${res.status}`);
            }
            return res.json();
        }).then(updatedUser => {
            if (onChangeTransaction) {
                onChangeTransaction(updatedUser.transactions);
            }
        })
    }

    return (
        <div className="input-container" >
            <select
                style={{ background: selectColor, color: 'black' }}
                id="input-type"
                value={transactionType}
                onChange={handleTransactionTypeChange}
            >
                <option value="">--Choose Input type--</option>
                <option value="Income">Income</option>
                <option value="Expense">Expense</option>
                <option value="Savings">Savings</option>
                <option value="Investing">Investing</option>
            </select>
            {options()}
            <input
                type='number'
                placeholder='Amount'
                value={amount === 0 ? '' : amount}
                style={{ background: selectColor, color: 'black' }}
                onChange={e => setAmount(Number(e.target.value))}
            />
            <input
                type='date'
                style={{ background: selectColor, color: 'black' }}
                value={date ? new Date(date).toISOString().split('T')[0] : ''}
                onChange={handleDateChange}
            />
            {isEditing ? <button onClick={editTransaction}>Save Changes</button> : <button onClick={addTransaction}>Submit</button>}
        </div >
    );
}

export default MoneyInput;