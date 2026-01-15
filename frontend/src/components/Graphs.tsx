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
    const [showOverallSpending, setShowOverallSpending] = useState(true);
    const [expenseStatPercent, setExpenseStatPercent] = useState<{ id: string | undefined; value: number; color: string; label: string }[]>([]);
    const [expenseStats, setExpenseStats] = useState<{ id: string | undefined; value: number; color: string; label: string }[]>([]);

    const screenWidth: number = window.innerWidth;
    const screenHeight: number = window.innerHeight;
    const MAXCATEGORYITEMS: number = 10;

    // string to color hex code to keep expense graph consistent
    // important for if the order of which expense is greatest changes from month to month
    function stringToColor(str: string): string {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
            hash |= 0;
        }

        const min = 80; // removes dark colors
        let color = '#';

        for (let i = 0; i < 3; i++) {
            let value = (hash >> (i * 8)) & 0xff;
            value = Math.max(value, min);
            color += value.toString(16).padStart(2, '0');
        }

        return color;
    }

    useEffect(() => {
        let tempWants = 0;
        let tempNeeds = 0;
        let tempSavings = 0;
        let tempIncome = 0;

        let dateMonth = dateSelection.split(" ")[0];
        let dateYear = dateSelection.split(" ")[1];

        let categoryStats = new Map<string, number>();

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

                    if (!showOverallSpending && e.categoryType !== undefined && e.transactionType === "Expense") {
                        categoryStats.set(e.categoryType, (categoryStats.get(e.categoryType) ?? 0) + e.amount);
                    }
                }
            }
        });

        let newExpenseStats: { id: string | undefined; value: number; color: string; label: string }[] = [];
        let newExpenseStatPercent: { id: string | undefined; value: number; color: string; label: string }[] = [];

        categoryStats.forEach((value, key) => {
            newExpenseStats.push({ id: key, value: value, color: stringToColor(key), label: key })
            newExpenseStatPercent.push({ id: key, value: parseFloat((value / (tempNeeds + tempWants) * 100).toFixed(2)), color: stringToColor(key), label: key })
        })

        setExpenseStats(newExpenseStats.sort((a, b) => b.value - a.value));
        setExpenseStatPercent(newExpenseStatPercent.sort((a, b) => b.value - a.value));
        setWants(parseFloat(tempWants.toFixed(2)));
        setNeeds(parseFloat(tempNeeds.toFixed(2)));
        setSavings(parseFloat(tempSavings.toFixed(2)));
        setIncome(parseFloat(tempIncome.toFixed(2)));
    }, [transactions, dateSelection, filter, showOverallSpending]);

    return (
        <div className='graphs'>
            <p style={{ margin: 0 }}>Spending for {dateSelection ? dateSelection : "all dates"}</p>
            {showOverallSpending
                ?
                income > 0
                    ?
                    <PieChart
                        slots={{
                            legend: () => null,
                        }}
                        series={[
                            {
                                arcLabel: (item) => `${item.id} ${item.value}%`,
                                arcLabelMinAngle: 10,
                                arcLabelRadius: '50%',
                                data: [
                                    { id: 'Needs', value: parseFloat((needs / income * 100).toFixed(2)), color: '#82ff71ff', label: 'Needs' },
                                    { id: 'Wants', value: parseFloat((wants / income * 100).toFixed(2)), color: '#FF6B6B', label: 'Wants' },
                                    { id: 'Savings', value: parseFloat((savings / income * 100).toFixed(2)), color: '#FFE66D', label: 'Savings' },
                                    { id: 'Extra', value: parseFloat(((income - needs - wants - savings) / income * 100).toFixed(2)), color: 'gray', label: 'Extra' },
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
                        slots={{
                            legend: () => null,
                        }}
                        series={[
                            {
                                arcLabel: (item) => `${item.id} $${item.value}`,
                                arcLabelMinAngle: 10,
                                arcLabelRadius: '50%',
                                data: [
                                    { id: 'Needs', value: parseFloat((needs).toFixed(2)), color: '#82ff71ff', label: 'Needs' },
                                    { id: 'Wants', value: parseFloat((wants).toFixed(2)), color: '#FF6B6B', label: 'Wants' },
                                    { id: 'Savings', value: parseFloat((savings).toFixed(2)), color: '#FFE66D', label: 'Savings' },
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
                    slots={{
                        legend: () => null,
                    }}
                    series={[
                        {
                            arcLabel: (item) => `${item.id} ${item.value}%`,
                            arcLabelMinAngle: 10,
                            arcLabelRadius: '50%',
                            data: expenseStatPercent,
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
            {showOverallSpending
                ?
                <p style={{ margin: 0 }}>
                    Needs: ${parseFloat((needs).toFixed(2))} <br />
                    Wants: ${parseFloat((wants).toFixed(2))} <br />
                    Savings: ${parseFloat((savings).toFixed(2))} <br />
                    Total: ${(parseFloat((needs).toFixed(2)) + parseFloat((wants).toFixed(2)) + parseFloat((savings).toFixed(2))).toFixed(2)} <br />
                    Extra: ${parseFloat(((income - needs - wants - savings)).toFixed(2))}<br />
                </p>
                :
                <ul style={{ margin: 0 }}>
                    {expenseStats.slice(0, MAXCATEGORYITEMS).map((stat) => (
                        <li key={stat.id} style={{ color: stat.color }}>
                            {stat.label}: {stat.value.toFixed(2)}
                        </li>
                    ))}
                </ul>
            }

            {showOverallSpending ? <button onClick={() => setShowOverallSpending(false)}>Show Category Spending</button> : <button onClick={() => setShowOverallSpending(true)}>Show Overall Spending</button>}
        </div>
    )
}

export default Graphs;