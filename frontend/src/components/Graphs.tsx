import { PieChart } from '@mui/x-charts';
import { useEffect, useState } from 'react';

type GraphsProps = {
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

const Graphs: React.FC<GraphsProps> = ({ dateSelection, transactions }) => {
    const [wants, setWants] = useState(0);
    const [needs, setNeeds] = useState(0);
    const [savings, setSavings] = useState(0);
    const [income, setIncome] = useState(0);

    useEffect(() => {
        let tempWants = 0;
        let tempNeeds = 0;
        let tempSavings = 0;
        let tempIncome = 0;

        let dateMonth = dateSelection.split(" ")[0];
        let dateYear = dateSelection.split(" ")[1];

        transactions.forEach(e => {
            let transactionDate = new Date(e.date);

            let transactionMonthName = transactionDate.toLocaleString('default', { month: 'long' });
            let transactionYear = transactionDate.getFullYear();

            if ((transactionMonthName === dateMonth && String(transactionYear) === dateYear) || dateSelection === "") {
                if (e.transactionCategory === "Wants") {
                    tempWants += e.amount;
                } else if (e.transactionCategory === "Needs") {
                    tempNeeds += e.amount;
                } else if (e.transactionType === "Savings") {
                    tempSavings += e.amount;
                } else if (e.transactionType === "Income") {
                    tempIncome += e.amount;
                }
            }
        });

        setWants(parseFloat(tempWants.toFixed(2)));
        setNeeds(parseFloat(tempNeeds.toFixed(2)));
        setSavings(parseFloat(tempSavings.toFixed(2)));
        setIncome(parseFloat(tempIncome.toFixed(2)));
    }, [transactions, dateSelection]); // recalculate data when transactions or dateselection changes

    return (
        <div className='graphs'>
            <p>Current budgeting Method</p>
            <PieChart
                series={[
                    {
                        arcLabel: (item) => `${item.id} ${item.value}%`,
                        arcLabelMinAngle: 35,
                        arcLabelRadius: '50%',
                        data: [
                            { id: 'Needs', value: 50, color: 'green' },
                            { id: 'Wants', value: 30, color: 'red' },
                            { id: 'Savings', value: 20, color: 'yellow' },
                        ],
                    },
                ]}
                width={350}
                height={350}
            />
            <p>Spending for {dateSelection ? dateSelection : "all dates"}</p>
            {income > 0
                ?
                <PieChart
                    series={[
                        {
                            arcLabel: (item) => `${item.id} ${item.value}%`,
                            arcLabelMinAngle: 10,
                            arcLabelRadius: '50%',
                            data: [
                                { id: 'Needs', value: parseFloat((needs / income * 100).toFixed(2)), color: 'green' },
                                { id: 'Wants', value: parseFloat((wants / income * 100).toFixed(2)), color: 'red' },
                                { id: 'Savings', value: parseFloat((savings / income * 100).toFixed(2)), color: 'yellow' },
                                { id: 'Extra', value: parseFloat(((income - needs - wants - savings) / income * 100).toFixed(2)), color: 'gray' },
                            ],
                        },
                    ]}
                    width={350}
                    height={350}
                />
                :
                <PieChart
                    series={[
                        {
                            arcLabel: (item) => `${item.id} $${item.value}`,
                            arcLabelMinAngle: 10,
                            arcLabelRadius: '50%',
                            data: [
                                { id: 'Needs', value: parseFloat((needs).toFixed(2)), color: 'green' },
                                { id: 'Wants', value: parseFloat((wants).toFixed(2)), color: 'red' },
                                { id: 'Savings', value: parseFloat((savings).toFixed(2)), color: 'yellow' },
                            ],
                        },
                    ]}
                    width={350}
                    height={350}
                />
            }
            <p>
                Needs: ${parseFloat((needs).toFixed(2))} Wants: ${parseFloat((wants).toFixed(2))} Savings: ${parseFloat((savings).toFixed(2))} Extra: ${parseFloat(((income - needs - wants - savings)).toFixed(2))}
            </p>
        </div>
    )
}

export default Graphs;