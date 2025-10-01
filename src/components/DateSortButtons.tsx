import { tempData } from "../assets/tempData"
import React, { useState, useEffect } from 'react';

type DateSortButtonsProps = {
    onDateSelectionChange: (option: string) => void;
}

const DateSortButtons: React.FC<DateSortButtonsProps> = ({ onDateSelectionChange }) => {
    const [months, setMonths] = useState<string[]>([]);

    useEffect(() => {
        let tempMonths: string[] = [];

        tempData.forEach(e => {
            let dateObject = new Date(e.date);

            let monthName = dateObject.toLocaleString('default', { month: 'long' });
            let year = dateObject.getFullYear();

            let fullDate = monthName + " " + year;

            console.log(fullDate);
            if (!tempMonths.includes(fullDate)) {
                tempMonths.push(fullDate)
            }

            setMonths(tempMonths);
        })
    }, [])

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
            <button>Show all months</button>
            {months.map((e) => (
                <button onClick={(() => onDateSelectionChange(e))}>{e}</button>
            ))}
        </div>
    )
}

export default DateSortButtons;