import { useState } from "react"

type TransactionType = {
    id: number;
    transactionType: string;
    transactionCategory?: string;
    categoryType?: string;
    subCategoryType?: string;
    amount: number;
    date: string;
}

type MoneyInputProps = {
    onAddTransaction: (option: TransactionType[]) => void;
}

/*TODO: 
        add edit/delete
*/
const MoneyInput: React.FC<MoneyInputProps> = ({ onAddTransaction }) => {
    // export default function MoneyInput() {
    const [selectColor, setSelectColor] = useState('#6d6d6dff');
    const [transactionType, setTransactionType] = useState('');
    const [transactionCategory, setTransactionCategory] = useState('');
    const [categoryType, setCategoryType] = useState('');
    const [subCategoryType, setSubCategoryType] = useState('');
    const [amount, setAmount] = useState(0);
    const [date, setDate] = useState("");

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
                    <select
                        style={{ background: selectColor, color: 'black' }}
                        onChange={e => setTransactionCategory(e.target.value)}
                    >
                        <option>--Choose category of income--</option>
                        <option>Paycheck</option>
                        <option>Bonus</option>
                        <option>Gifts</option>
                    </select>
                );
            case 'Expense':
                return (
                    <>
                        <select
                            style={{ background: selectColor, color: 'black' }}
                            onChange={e => setTransactionCategory(e.target.value)}
                        >
                            <option>--Choose category of expense--</option>
                            <option>Wants</option>
                            <option>Needs</option>
                            <option>Paycheck</option>
                        </select>
                        <select
                            style={{ background: selectColor, color: 'black' }}
                            onChange={e => setCategoryType(e.target.value)}
                        >
                            <option>--Choose category-type--</option>
                            <option>Food</option>
                            <option>Transportation</option>
                            <option>Insurance</option>
                        </select>
                        <select
                            style={{ background: selectColor, color: 'black' }}
                            onChange={e => setSubCategoryType(e.target.value)}
                        >
                            <option>--Choose sub-category-type--</option>
                            <option>Groceries</option>
                            <option>Restaraunts</option>
                        </select>
                    </>
                );
            default:
                return null;
        }
    }

    function addTransaction() {
        let dateId = new Date()
        fetch('/api/addTransaction/3', {
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
            onAddTransaction(updatedUser.transactions);
        }).catch(error => {
            console.error("Error updating resource: ", error);
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
                placeholder="Amount"
                style={{ background: selectColor, color: 'black' }}
                onChange={e => setAmount(Number(e.target.value))}
            />
            <input
                type='date'
                style={{ background: selectColor, color: 'black' }}
                onChange={handleDateChange}
            />
            <button onClick={addTransaction}>Submit</button>
        </div >
    );
}

export default MoneyInput;