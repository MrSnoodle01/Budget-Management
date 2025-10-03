import { useState } from "react"

/* 
    type of input(string): income/expense/savings/investing/new custom input
    category of input(string): wants/needs/paycheck/new custom input
    category(string): food/transportation/insurance/new custom category
    subcategory(string): food --> groceries/restaraunts/new custom subcategory
    cost amount(float): 
    Date(string):
*/

/*TODO: add cusom input stuff
        add edit/delete
*/
export default function MoneyInput() {
    const [selectColor, setSelectColor] = useState('#6d6d6dff');
    const [inputType, setInputType] = useState('');

    function handleInputTypeChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const value = e.target.value;
        setInputType(value);
        if (value === "Income") {
            setSelectColor('#91ff83ff');
        } else if (value === "Expense") {
            setSelectColor('#ff7676ff');
        } else {
            setSelectColor('#d4d235ff');
        }
    }

    function options() {
        switch (inputType) {
            case 'Income':
                return (
                    <select style={{ background: selectColor, color: 'black' }}>
                        <option>--Choose category of income--</option>
                        <option>Paycheck</option>
                        <option>Bonus</option>
                        <option>Gifts</option>
                    </select>
                );
            case 'Expense':
                return (
                    <>
                        <select style={{ background: selectColor, color: 'black' }}>
                            <option>--Choose category of expense--</option>
                            <option>Wants</option>
                            <option>Needs</option>
                            <option>Paycheck</option>
                        </select>
                        <select style={{ background: selectColor, color: 'black' }}>
                            <option>--Choose sub-category--</option>
                            <option>Food</option>
                            <option>Transportation</option>
                            <option>Insurance</option>
                        </select>
                        <select style={{ background: selectColor, color: 'black' }}>
                            <option>--Choose sub-sub-category--</option>
                            <option>Groceries</option>
                            <option>Restaraunts</option>
                        </select>
                    </>
                );
            default:
                return null;
        }
    }

    return (
        <div className="input-container" >
            <select
                style={{ background: selectColor, color: 'black' }}
                id="input-type"
                value={inputType}
                onChange={handleInputTypeChange}
            >
                <option value="">--Choose Input type--</option>
                <option value="Income">Income</option>
                <option value="Expense">Expense</option>
                <option value="Savings">Savings</option>
                <option value="Investing">Investing</option>
            </select>
            {options()}
            <input type='number' placeholder="Amount" style={{ background: selectColor, color: 'black' }} />
            <input type='date' style={{ background: selectColor, color: 'black' }} />
        </div >
    );
}