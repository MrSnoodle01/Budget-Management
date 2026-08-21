import { useEffect, useState } from 'react';
import { LineChart as XLineChart } from '@mui/x-charts';
import type { TransactionType } from '../types/transaction';
import type { FilterType } from '../types/filter';

type LineChartProps = {
    transactions: TransactionType[];
    filter: FilterType;
    width: number;
    height: number;
    selectedMonth: string;
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

const LineChart: React.FC<LineChartProps> = ({ transactions, filter, width, height, selectedMonth }) => {
    const [yearMonthMap, setYearMonthMap] = useState<string[]>([]);
    const [monthlySpending, setMonthlySpending] = useState<number[]>([]);
    const [monthlyEarnings, setMonthlyEarnings] = useState<number[]>([]);
    const [monthlySavings, setMonthlySavings] = useState<number[]>([]);
    const [monthlyInvesting, setMonthlyInvesting] = useState<number[]>([]);

    useEffect(() => {
        const tempSpending: Record<string, number> = {};
        const tempEarnings: Record<string, number> = {};
        const tempSavings: Record<string, number> = {};
        const tempInvesting: Record<string, number> = {};

        let months: string[] = [];

        // Show all months: use the 12 most recent months
        if (selectedMonth === "") {
            if (transactions.length === 0) {
                return;
            }

            // Find the most recent transaction date
            const mostRecentDate = transactions.reduce((latest, transaction) => {
                const transactionDate = new Date(transaction.date);

                return transactionDate > latest ? transactionDate : latest;
            }, new Date(transactions[0].date));

            // Generate the 12 months ending with the most recent transaction
            for (let i = 11; i >= 0; i--) {
                const date = new Date(
                    mostRecentDate.getFullYear(),
                    mostRecentDate.getMonth() - i,
                    1
                );

                const monthName = date.toLocaleString("default", {
                    month: "long",
                });

                const year = date.getFullYear();

                months.push(`${monthName} ${year}`);
            }
        }

        // A specific year was selected
        else if (/^\d{4}$/.test(selectedMonth)) {
            const selectedYear = Number(selectedMonth);

            for (let month = 0; month < 12; month++) {
                const date = new Date(selectedYear, month, 1);

                const monthName = date.toLocaleString("default", {
                    month: "long",
                });

                months.push(`${monthName} ${selectedYear}`);
            }
        }

        // A specific month was selected, e.g. "August 2026"
        else {
            const [selectedMonthName, selectedYearString] =
                selectedMonth.split(" ");

            const selectedYear = Number(selectedYearString);
            const selectedMonthNumber = monthMap[selectedMonthName];

            for (let i = 11; i >= 0; i--) {
                const date = new Date(
                    selectedYear,
                    selectedMonthNumber - i,
                    1
                );

                const monthName = date.toLocaleString("default", {
                    month: "long",
                });

                const year = date.getFullYear();

                months.push(`${monthName} ${year}`);
            }
        }

        // Initialize every month to 0
        months.forEach((month) => {
            tempSpending[month] = 0;
            tempEarnings[month] = 0;
            tempSavings[month] = 0;
            tempInvesting[month] = 0;
        });

        // Process transactions
        transactions.forEach((e) => {
            const dateObject = new Date(e.date);

            const monthName = dateObject.toLocaleString("default", {
                month: "long",
            });

            const year = dateObject.getFullYear();

            const fullDate = `${monthName} ${year}`;

            // Ignore transactions outside the displayed months
            if (!months.includes(fullDate)) {
                return;
            }

            const hasFilter =
                (filter.transactionType === "All" ||
                    e.transactionType === filter.transactionType) &&
                (filter.transactionCategory === "All" ||
                    e.transactionCategory === filter.transactionCategory) &&
                (filter.categoryType === "All" ||
                    e.categoryType === filter.categoryType) &&
                (filter.subCategoryType === "All" ||
                    e.subCategoryType === filter.subCategoryType);

            if (!hasFilter) {
                return;
            }

            if (e.transactionType === "Expense") {
                tempSpending[fullDate] += e.amount;
            } else if (e.transactionType === "Savings") {
                tempSavings[fullDate] += e.amount;
            } else if (e.transactionType === "Income") {
                tempEarnings[fullDate] += e.amount;
            } else if (e.transactionType === "Investing") {
                tempInvesting[fullDate] += e.amount;
            }
        });

        setYearMonthMap(months);
        setMonthlySpending(months.map((month) => tempSpending[month]));
        setMonthlyEarnings(months.map((month) => tempEarnings[month]));
        setMonthlySavings(months.map((month) => tempSavings[month]));
        setMonthlyInvesting(months.map((month) => tempInvesting[month]));

    }, [transactions, filter, selectedMonth]);

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
                        tickLabelStyle: { fill: '#ccc', fontSize: '11.25px' },
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
                    {
                        label: 'Investing',
                        data: monthlyInvesting,
                        color: '#4D96FF'
                    },
                ]}
                width={width}
                height={height}
            />
        </div>
    )
};

export default LineChart;