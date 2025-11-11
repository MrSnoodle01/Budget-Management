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

    // returns a sorted array of transaction amounts based on the month and year
    function sortTransactionsByDate(tempRecord: Record<string, number>): number[] {
        const sortedArr: string[] = (Object.keys(tempRecord).sort((a, b) => {
            const [monthA, yearA] = a.split(" ");
            const [monthB, yearB] = b.split(" ");
            if (Number(yearA) === Number(yearB)) {
                return monthMap[monthA] - monthMap[monthB];
            }
            return Number(yearA) - Number(yearB);
        }));
        return sortedArr.filter(date => tempRecord[date] !== undefined).map(date => tempRecord[date]);
    }

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

        setMonthlyEarnings(sortTransactionsByDate(tempEarnings).slice(-13).slice(-13));
        setMonthlySavings(sortTransactionsByDate(tempSavings).slice(-13));
        setMonthlySpending(sortTransactionsByDate(tempSpending).slice(-13));

        // convert months to sorted object
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
        console.log(allMonths);

        setYearMonthMap(allMonths.slice(-13));
    }, [transactions, filter])

    return (
        <div className='line-chart'>
            <XLineChart
                xAxis={[
                    {
                        scaleType: 'band',
                        data: yearMonthMap,
                        valueFormatter: (value) => {
                            const [month, year] = value.split(' ');
                            return `${month.slice(0, 3)} ${year}`;
                        },
                        tickLabelStyle: {
                            fill: '#ccc',
                        },
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
                        color: '#FF6B6B',
                    },
                    {
                        label: 'Earnings',
                        data: monthlyEarnings,
                        color: '#82ff71ff',
                    },
                    {
                        label: 'Savings',
                        data: monthlySavings,
                        color: '#FFE66D',
                    },
                ]}
                width={screenWidth / 1.75}
                height={screenHeight / 3}
            />
        </div>
    )
};

export default LineChart;