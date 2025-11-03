import { PieChart, pieArcLabelClasses } from '@mui/x-charts';
import { useEffect, useState } from 'react';
import type { TransactionType } from '../types/transaction';
import type { FilterType } from '../types/filter';

type GraphsProps = {
    dateSelection: string;
    transactions: TransactionType[];
    filter: FilterType;
}

const Graphs: React.FC<GraphsProps> = ({ dateSelection, transactions, filter }) => {
    const [wants, setWants] = useState(0);
    const [needs, setNeeds] = useState(0);
    const [savings, setSavings] = useState(0);
    const [income, setIncome] = useState(0);

    const screenWidth: number = window.innerWidth;
    const screenHeight: number = window.innerHeight;

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

            // if dateYear is undefined then we are searching by year only, which gets put into dateMonth
            if ((transactionMonthName === dateMonth && String(transactionYear) === dateYear) || dateSelection === "" || (dateYear === undefined && String(transactionYear) === dateMonth)) {
                const hasFilter = (filter.transactionType === 'All' || e.transactionType === filter.transactionType) &&
                    (filter.transactionCategory === 'All' || e.transactionCategory === filter.transactionCategory) &&
                    (filter.categoryType === 'All' || e.categoryType === filter.categoryType) &&
                    (filter.subCategoryType === 'All' || e.subCategoryType === filter.subCategoryType);
                if (hasFilter) {
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
            }
        });

        setWants(parseFloat(tempWants.toFixed(2)));
        setNeeds(parseFloat(tempNeeds.toFixed(2)));
        setSavings(parseFloat(tempSavings.toFixed(2)));
        setIncome(parseFloat(tempIncome.toFixed(2)));
    }, [transactions, dateSelection, filter]);

    return (
        <div className='graphs'>
            <p>Suggested budgeting Method</p>
            <PieChart
                series={[
                    {
                        arcLabel: (item) => `${item.id} ${item.value}%`,
                        arcLabelMinAngle: 35,
                        arcLabelRadius: '50%',
                        data: [
                            { id: 'Needs', value: 50, color: '#82ff71ff' },
                            { id: 'Wants', value: 30, color: '#FF6B6B' },
                            { id: 'Savings', value: 20, color: '#FFE66D' },
                        ],
                    },
                ]}
                width={screenWidth / 3}
                height={screenHeight / 3}
                sx={{
                    [`& .${pieArcLabelClasses.root}`]: {
                        fontSize: String(screenWidth / 120) + 'px',
                    },
                }}
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
                                { id: 'Needs', value: parseFloat((needs / income * 100).toFixed(2)), color: '#82ff71ff' },
                                { id: 'Wants', value: parseFloat((wants / income * 100).toFixed(2)), color: '#FF6B6B' },
                                { id: 'Savings', value: parseFloat((savings / income * 100).toFixed(2)), color: '#FFE66D' },
                                { id: 'Extra', value: parseFloat(((income - needs - wants - savings) / income * 100).toFixed(2)), color: 'gray' },
                            ],
                        },
                    ]}
                    width={screenWidth / 3}
                    height={screenHeight / 3}
                    sx={{
                        [`& .${pieArcLabelClasses.root}`]: {
                            fontSize: String(screenWidth / 120) + 'px',
                        },
                    }}
                />
                :
                <PieChart
                    series={[
                        {
                            arcLabel: (item) => `${item.id} $${item.value}`,
                            arcLabelMinAngle: 10,
                            arcLabelRadius: '50%',
                            data: [
                                { id: 'Needs', value: parseFloat((needs).toFixed(2)), color: '#82ff71ff' },
                                { id: 'Wants', value: parseFloat((wants).toFixed(2)), color: '#FF6B6B' },
                                { id: 'Savings', value: parseFloat((savings).toFixed(2)), color: '#FFE66D' },
                            ],
                        },
                    ]}
                    width={screenWidth / 3}
                    height={screenHeight / 3}
                    sx={{
                        [`& .${pieArcLabelClasses.root}`]: {
                            fontSize: String(screenWidth / 120) + 'px',
                        },
                    }}
                />
            }
            <p>
                Needs: ${parseFloat((needs).toFixed(2))} Wants: ${parseFloat((wants).toFixed(2))} Savings: ${parseFloat((savings).toFixed(2))} Total: ${(parseFloat((needs).toFixed(2)) + parseFloat((wants).toFixed(2)) + parseFloat((savings).toFixed(2))).toFixed(2)} Extra: ${parseFloat(((income - needs - wants - savings)).toFixed(2))}
            </p>
        </div>
    )
}

export default Graphs;