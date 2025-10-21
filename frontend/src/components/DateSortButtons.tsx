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
    const [months, setMonths] = useState<string[]>([]);
    const [chosenMonth, setChosenMonth] = useState("");

    useEffect(() => {
        let tempMonths: string[] = [];

        transactions.forEach(e => {
            let dateObject = new Date(e.date);

            let monthName = dateObject.toLocaleString('default', { month: 'long' });
            let year = dateObject.getFullYear();

            let fullDate = monthName + " " + year;

            if (!tempMonths.includes(fullDate)) {
                tempMonths.push(fullDate)
            }
        })

        const sortedDates = [...tempMonths].sort((a, b) => {
            const [monthA, yearA] = a.split(" ");
            const [monthB, yearB] = b.split(" ");
            const dateA = new Date(Number(yearA), monthMap[monthA]);
            const dateB = new Date(Number(yearB), monthMap[monthB]);
            return dateB.getTime() - dateA.getTime();
        })

        setMonths(sortedDates);
    }, [onDateSelectionChange, transactions])

    const handleClick = (month: string) => {
        setChosenMonth(month);
        onDateSelectionChange(month);
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
            <button onClick={(() => handleClick(""))} style={{ backgroundColor: chosenMonth === "" ? "#646cff" : "" }}>Show all months</button>
            {months.map((e) => (
                <button
                    key={e}
                    onClick={() => handleClick(e)}
                    style={{ backgroundColor: chosenMonth === e ? "#646cff" : "" }}
                >{e}</button>
            ))}
        </div>
    )
}

export default DateSortButtons;