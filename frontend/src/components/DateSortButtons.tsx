import React, { useState, useEffect } from 'react';

type TransactionType = {
    id: number;
    transactionType: string;
    transactionCategory?: string;
    categoryType?: string;
    subCategoryType?: string;
    amount: number;
    date: string;
}

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

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
            <button onClick={(() => onDateSelectionChange(""))}>Show all months</button>
            {months.map((e) => (
                <button key={e} onClick={(() => onDateSelectionChange(e))}>{e}</button>
            ))}
        </div>
    )
}

export default DateSortButtons;