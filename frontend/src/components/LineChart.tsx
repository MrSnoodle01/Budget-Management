import { useEffect, useState } from 'react';
import { LineChart as XLineChart } from '@mui/x-charts';
import type { TransactionType } from '../types/transaction';
import type { FilterType } from '../types/filter';

type LineChartProps = {
    transactions: TransactionType[];
    filter: FilterType;
};

const monthMap: Record<string, number> = {
    January: 0,
    February: 1,
    March: 2,
    April: 3,
    May: 4,
    June: 5,
    July: 6,
    August: 7,
    September: 8,
    October: 9,
    November: 10,
    December: 11,
};

const LineChart: React.FC<LineChartProps> = ({ transactions, filter }) => {
    const [yearMonthMap, setYearMonthMap] = useState<string[]>([]);
    const [monthlySpending, setMonthlySpending] = useState<number[]>([]);
    const [monthlyEarnings, setMonthlyEarnings] = useState<number[]>([]);
    const [monthlySavings, setMonthlySavings] = useState<number[]>([]);

    const screenWidth: number = window.innerWidth;
    const screenHeight: number = window.innerHeight;

    useEffect(() => {
        let tempMap: Record<string, Set<string>> = {};
        let tempSpending: Record<string, number> = {};
        let tempEarnings: Record<string, number> = {};
        let tempSavings: Record<string, number> = {};

        // get all unique transaction dates
        transactions.forEach(e => {
            let dateObject = new Date(e.date);

            let monthName = dateObject.toLocaleString('default', { month: 'long' });
            let year = dateObject.getFullYear();

            let fullDate = `${monthName} ${year}`;

            if (!tempMap[year]) {
                tempMap[year] = new Set();
            }
            tempMap[year].add(fullDate);

            if (!tempSpending[fullDate]) {
                tempSpending[fullDate] = 0;
            }
            if (!tempSavings[fullDate]) {
                tempSavings[fullDate] = 0;
            }

            if (!tempEarnings[fullDate]) {
                tempEarnings[fullDate] = 0;
            }


            const hasFilter = (filter.transactionType === 'All' || e.transactionType === filter.transactionType) &&
                (filter.transactionCategory === 'All' || e.transactionCategory === filter.transactionCategory) &&
                (filter.categoryType === 'All' || e.categoryType === filter.categoryType) &&
                (filter.subCategoryType === 'All' || e.subCategoryType === filter.subCategoryType);
            if (hasFilter) {
                if (e.transactionType === "Expense") {
                    tempSpending[fullDate] += e.amount;
                } else if (e.transactionType === "Savings") {
                    tempSavings[fullDate] += e.amount;
                } else if (e.transactionType === "Income") {
                    tempEarnings[fullDate] += e.amount;
                }
            }
        })
        setMonthlyEarnings(Object.values(tempEarnings).flat().reverse());
        setMonthlySavings(Object.values(tempSavings).flat().reverse());
        setMonthlySpending(Object.values(tempSpending).flat().reverse());

        // convert to sorted object
        const sortedMap: Record<string, string[]> = {};
        const sortedYears = Object.keys(tempMap).sort((a, b) => Number(b) - Number(a));

        sortedYears.forEach((year) => {
            const sortedMonths = Array.from(tempMap[year]).sort((a, b) => {
                const [monthA] = a.split(" ");
                const [monthB] = b.split(" ");
                return monthMap[monthA] - monthMap[monthB];
            });
            sortedMap[year] = sortedMonths;
        });

        const allMonths = Object.values(sortedMap).flat();

        setYearMonthMap(allMonths);
    }, [transactions, filter])

    return (
        <XLineChart
            xAxis={[
                {
                    scaleType: 'band',
                    data: yearMonthMap,
                    tickLabelStyle: { fill: '#ccc' },
                },
            ]}
            yAxis={[
                {
                    tickLabelStyle: { fill: '#ccc' },
                },
            ]}
            slotProps={{
                legend: {
                    sx: {
                        color: '#ccc',
                    },
                },
            }}
            series={[
                {
                    label: 'Spending',
                    data: monthlySpending,
                    color: '#ff7676ff',
                },
                {
                    label: 'Earnings',
                    data: monthlyEarnings,
                    color: '#91ff83ff',
                },
                {
                    label: 'Savings',
                    data: monthlySavings,
                    color: '#d4d235ff',
                },
            ]}
            width={screenWidth / 1.75}
            height={screenHeight / 3}
        />
    )
};

export default LineChart;