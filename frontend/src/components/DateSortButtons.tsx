import React, { useState, useEffect } from 'react';
import type { TransactionType } from '../types/transaction';

type DateSortButtonsProps = {
    onDateSelectionChange: (option: string) => void;
    transactions: TransactionType[];
}

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

const DateSortButtons: React.FC<DateSortButtonsProps> = ({ onDateSelectionChange, transactions }) => {
    const [yearMonthMap, setYearMonthMap] = useState<Record<string, string[]>>({});
    const [chosenOption, setChosenOption] = useState("");

    useEffect(() => {
        let tempMap: Record<string, Set<string>> = {};

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
        })

        // convert to sorted object
        const sortedMap: Record<string, string[]> = {};
        const sortedYears = Object.keys(tempMap).sort((a, b) => Number(b) - Number(a));

        sortedYears.forEach((year) => {
            const sortedMonths = Array.from(tempMap[year]).sort((a, b) => {
                const [monthA] = a.split(" ");
                const [monthB] = b.split(" ");
                return monthMap[monthB] - monthMap[monthA]; // descending sort
            });
            sortedMap[year] = sortedMonths;
        });

        setYearMonthMap(sortedMap);
    }, [onDateSelectionChange, transactions])

    const handleClick = (month: string) => {
        setChosenOption(month);
        onDateSelectionChange(month);
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
            <button onClick={(() => handleClick(""))} style={{ backgroundColor: chosenOption === "" ? "#646cff" : "" }}>Show all months</button>
            {Object.keys(yearMonthMap)
                .sort((a, b) => Number(b) - Number(a))
                .map((year) => (
                    <React.Fragment key={year}>
                        <button
                            key={year}
                            onClick={() => handleClick(year)}
                            style={{ backgroundColor: chosenOption === year ? "#646cff" : "" }}
                        >
                            {year}
                        </button>
                        {yearMonthMap[year].map((month) => (
                            <button
                                key={month + year}
                                onClick={() => handleClick(month)}
                                style={{ backgroundColor: chosenOption === month ? "#646cff" : "" }}
                            >
                                {month}
                            </button>
                        ))}
                    </React.Fragment>
                ))}
        </div>
    )
}

export default DateSortButtons;