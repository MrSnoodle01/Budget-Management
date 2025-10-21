import { useEffect, useState } from 'react';
import type { TransactionType } from '../types/transaction';

type FilterSelection = {
    onChangeFilter: (option: string) => void;
    transactions: TransactionType[];
    dateSelection: string;
}

const FilterSelection: React.FC<FilterSelection> = ({ onChangeFilter, transactions, dateSelection }) => {
    const [filterOptions, setFilterOptions] = useState<string[]>([]);

    useEffect(() => {
        let tempFilters: string[] = ["All"];

        let dateMonth = dateSelection.split(" ")[0];
        let dateYear = dateSelection.split(" ")[1];

        transactions.forEach(e => {
            let transactionDate = new Date(e.date);

            let transactionMonthName = transactionDate.toLocaleString('default', { month: 'long' });
            let transactionYear = transactionDate.getFullYear();

            if ((transactionMonthName === dateMonth && String(transactionYear) === dateYear) || dateSelection === "") {
                if (!tempFilters.includes(e.transactionType)) {
                    tempFilters.push(e.transactionType);
                }
                if (e.transactionCategory && !tempFilters.includes(e.transactionCategory)) {
                    tempFilters.push(e.transactionCategory);
                }
                if (e.categoryType && !tempFilters.includes(e.categoryType)) {
                    tempFilters.push(e.categoryType);
                }
                if (e.subCategoryType && !tempFilters.includes(e.subCategoryType)) {
                    tempFilters.push(e.subCategoryType);
                }
            }
        })

        setFilterOptions(tempFilters);
    }, [dateSelection, transactions]);

    return (
        <div>
            <p>Filter by: </p>
            <select onChange={e => onChangeFilter(e.target.value)}>
                {filterOptions.map((filter, index) => (
                    <option key={index} value={filter}>{filter}</option>
                ))}
            </select>
        </div>
    )
}

export default FilterSelection;