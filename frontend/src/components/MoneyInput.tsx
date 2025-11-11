import { useState, useEffect } from "react"
import type { TransactionType } from '../types/transaction';

type MoneyInputProps = {
    onChangeTransaction?: (option: TransactionType[]) => void;
    isEditing?: boolean;
    editedTransaction?: TransactionType;
    transactions?: TransactionType[];
    onClose?: () => void;
}

type ExpenseType = {
    transactionCategory: string[];
    categoryType: string[];
    subCategoryType: string[];
}

const MoneyInput: React.FC<MoneyInputProps> = ({ onChangeTransaction, isEditing = false, editedTransaction = null, transactions = [], onClose }) => {
    const [selectColor, setSelectColor] = useState('#6d6d6dff');
    const [transactionType, setTransactionType] = useState('');
    const [transactionCategory, setTransactionCategory] = useState('');
    const [categoryType, setCategoryType] = useState('');
    const [subCategoryType, setSubCategoryType] = useState('');
    const [amount, setAmount] = useState(0);
    const [date, setDate] = useState('');
    const [incomeCategories, setIncomeCategories] = useState<string[]>([]);
    const [expenseCategories, setExpenseCategories] = useState<ExpenseType>();

    const token = localStorage.getItem("token");
    const API_URL = import.meta.env.VITE_API_URL;

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

    useEffect(() => {
        const incomeMap = new Map<string, number>();
        const expenseMap = new Map<string, number>();
        const expenseCategoryMap = new Map<string, number>();
        const expenseSubCategoryMap = new Map<string, number>();

        transactions.map(t => {
            if (t.transactionType === "Expense") {
                const category = t.transactionCategory;
                const categoryType = t.categoryType;
                const subCategoryType = t.subCategoryType;

                if (category) {
                    if (!expenseMap.has(category)) {
                        expenseMap.set(category, 0);
                    } else if (expenseMap.has(category)) {
                        expenseMap.set(category, (expenseMap.get(category) ?? 0) + 1)
                    }
                }
                if (categoryType) {
                    if (!expenseCategoryMap.has(categoryType)) {
                        expenseCategoryMap.set(categoryType, 1);
                    } else if (expenseCategoryMap.has(categoryType)) {
                        expenseCategoryMap.set(categoryType, (expenseCategoryMap.get(categoryType) ?? 0) + 1)
                    }
                }
                if (subCategoryType) {
                    if (!expenseSubCategoryMap.has(subCategoryType)) {
                        expenseSubCategoryMap.set(subCategoryType, 1);
                    } else if (expenseSubCategoryMap.has(subCategoryType)) {
                        expenseSubCategoryMap.set(subCategoryType, (expenseSubCategoryMap.get(subCategoryType) ?? 0) + 1)
                    }
                }
            } else {
                const category = t.transactionCategory;
                if (category) {
                    if (!incomeMap.has(category)) {
                        incomeMap.set(category, 0);
                    } else if (incomeMap.has(category)) {
                        incomeMap.set(category, (incomeMap.get(category) ?? 0) + 1)
                    }
                }
            }
        })

        setExpenseCategories({
            transactionCategory: Array.from(expenseMap.entries()).sort((a, b) => b[1] - a[1]).map(([key]) => key),
            categoryType: Array.from(expenseCategoryMap.entries()).sort((a, b) => b[1] - a[1]).map(([key]) => key),
            subCategoryType: Array.from(expenseSubCategoryMap.entries()).sort((a, b) => b[1] - a[1]).map(([key]) => key)
        })
        setIncomeCategories(Array.from(incomeMap.entries()).sort((a, b) => b[1] - a[1]).map(([key]) => key));
    }, [transactions])

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

    function capitalizeWords(sentence: string): string {
        if (!sentence) {
            return '';
        }
        return sentence
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')
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
                    <div className="input-group">
                        <label htmlFor="Category">
                            Income Category
                        </label>
                        <input
                            list='transactionCategoryList'
                            id="Category"
                            style={{ background: selectColor, color: 'black', borderRadius: '6px' }}
                            onChange={e => setTransactionCategory(e.target.value)}
                            value={transactionCategory}
                            placeholder={'Paycheck, Gift, etc.'}
                        />
                        <datalist id='transactionCategoryList'>
                            {incomeCategories.map((t) => {
                                return <option value={t} ></option>
                            })}
                        </datalist>
                    </div >
                );

            case 'Expense':
                return (
                    <>
                        <div className="input-group">
                            <label htmlFor="Category">
                                Expense Category
                            </label>
                            <input
                                list='transactionCategoryList'
                                id="Category"
                                style={{ background: selectColor, color: 'black', borderRadius: '6px' }}
                                onChange={e => setTransactionCategory(e.target.value)}
                                value={transactionCategory}
                                placeholder='Needs, Wants'
                            />
                            <datalist id='transactionCategoryList'>
                                {expenseCategories?.transactionCategory.map(t => {
                                    return <option value={t}></option>
                                })}
                            </datalist>
                        </div>
                        <div className="input-group">
                            <label htmlFor="Type">
                                Category Type
                            </label>
                            <input
                                list='categoryTypeList'
                                id="Type"
                                style={{ background: selectColor, color: 'black', borderRadius: '6px' }}
                                onChange={e => setCategoryType(e.target.value)}
                                value={categoryType}
                                placeholder='Food, Automotive, etc.'
                            />
                            <datalist id='categoryTypeList'>
                                {expenseCategories?.categoryType.map(t => {
                                    return <option value={t}></option>
                                })}
                            </datalist>
                        </div>
                        <div className="input-group">
                            <label htmlFor="subType">
                                Category Sub-Type
                            </label>
                            <input
                                list='subCategoryTypeList'
                                id="subType"
                                style={{ background: selectColor, color: 'black', borderRadius: '6px' }}
                                onChange={e => setSubCategoryType(e.target.value)}
                                value={subCategoryType}
                                placeholder='Restaurant, Gas, etc.'
                            />
                            <datalist id='subCategoryTypeList'>
                                {expenseCategories?.subCategoryType.map(t => {
                                    return <option value={t}></option>
                                })}
                            </datalist>
                        </div>
                    </>
                );
            default:
                return null;
        }
    }

    async function addTransaction() {
        let dateId = new Date()

        if (transactionType === "Savings" || transactionType === "Investing") {
            if (date === '' || amount <= 0) {
                alert("Please input all required categories");
                return;
            }
        } else if (transactionType === '' || transactionCategory === '' || date === '' || amount <= 0) {
            alert("Please input all required categories");
            return;
        }

        document.body.style.cursor = "wait";

        try {
            const res = await fetch(API_URL + "/api/addTransaction", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    transactions: [{
                        id: dateId.getTime(),
                        transactionType: capitalizeWords(transactionType),
                        transactionCategory: transactionType === "Income" || transactionType === "Expense" ? capitalizeWords(transactionCategory) : '',
                        categoryType: transactionType === "Expense" ? capitalizeWords(categoryType) : '',
                        subCategoryType: transactionType === "Expense" ? capitalizeWords(subCategoryType) : '',
                        amount,
                        date,
                    }],
                }),
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(`HTTP error ${res.status}: ${text}`);
            }

            const updatedUser = await res.json();
            if (onChangeTransaction) onChangeTransaction(updatedUser.transactions);
            console.log("Transaction added successfully");
        } catch (error) {
            console.error("Error updating resource:", error);
        } finally {
            document.body.style.cursor = "default";
        }
        resetFields();
    }

    function resetFields() {
        setTransactionCategory('');
        setCategoryType('');
        setSubCategoryType('');
        setAmount(0);
        setDate('');
    }

    function editTransaction() {
        if (!editedTransaction) return;

        fetch(API_URL + `/api/editTransaction?transactionId=${editedTransaction.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
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

        if (onClose) {
            onClose();
        }
    }

    return (
        <div className="input-container" >
            <div className="input-group">
                <label htmlFor="input-type">
                    Transaction Type
                </label>
                <select
                    style={{ background: selectColor, color: 'black', borderRadius: '6px' }}
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
            </div>
            {options()}
            <div className="input-group">
                <label htmlFor="amount">
                    Amount
                </label>
                <input
                    id="amount"
                    type='number'
                    placeholder='Amount'
                    value={amount === 0 ? '' : amount}
                    style={{ background: selectColor, color: 'black', borderRadius: '6px' }}
                    onChange={e => setAmount(Number(e.target.value))}
                />
            </div>
            <div className="input-group">
                <label htmlFor="date">
                    Date
                </label>
                <input
                    id="date"
                    type='date'
                    style={{ background: selectColor, color: 'black', borderRadius: '6px' }}
                    value={date ? new Date(date).toISOString().split('T')[0] : ''}
                    onChange={handleDateChange}
                />
            </div>
            {isEditing ? <button onClick={editTransaction}>Save Changes</button> : <button onClick={addTransaction}>Submit</button>}
        </div >
    );
}

export default MoneyInput;