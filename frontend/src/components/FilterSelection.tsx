import { useEffect, useState } from 'react';
import type { TransactionType } from '../types/transaction';
import type { FilterType } from '../types/filter';

type FilterSelection = {
    onChangeFilter: (option: FilterType) => void;
    transactions: TransactionType[];
    dateSelection: string;
}

const FilterSelection: React.FC<FilterSelection> = ({ onChangeFilter, transactions, dateSelection }) => {
    const [transactionTypeFilter, setTransactionTypeFilter] = useState<string[]>([]);
    const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
    const [categoryTypeFilter, setCategoryTypeFilter] = useState<string[]>([]);
    const [categorySubTypeFilter, setCategorySubTypeFilter] = useState<string[]>([]);
    const [currentFilter, setCurrentFilter] = useState<FilterType>({
        transactionType: 'All',
        transactionCategory: 'All',
        categoryType: 'All',
        subCategoryType: 'All'
    });

    useEffect(() => {
        let tempTransactionTypeFilters: string[] = ['All'];
        let tempCategoryFilters: string[] = ['All'];
        let tempCategoryTypeFilters: string[] = ['All'];
        let tempCategorySubTypeFilters: string[] = ['All'];

        let dateMonth = dateSelection.split(" ")[0];
        let dateYear = dateSelection.split(" ")[1];

        if (dateSelection.split(" ")[1] === undefined) { // if sorting by year only
            dateMonth = "";
            dateYear = dateSelection.split(" ")[0];
        }

        transactions.forEach(e => {
            let transactionDate = new Date(e.date);

            let transactionMonthName = transactionDate.toLocaleString('default', { month: 'long' });
            let transactionYear = transactionDate.getFullYear();

            if (((transactionMonthName === dateMonth || dateMonth === "") && String(transactionYear) === dateYear) || dateSelection === "") {
                if (!tempTransactionTypeFilters.includes(e.transactionType)) {
                    tempTransactionTypeFilters.push(e.transactionType);
                }
                if (e.transactionCategory && !tempCategoryFilters.includes(e.transactionCategory)) {
                    tempCategoryFilters.push(e.transactionCategory);
                }
                if (e.categoryType && !tempCategoryTypeFilters.includes(e.categoryType)) {
                    tempCategoryTypeFilters.push(e.categoryType);
                }
                if (e.subCategoryType && !tempCategorySubTypeFilters.includes(e.subCategoryType)) {
                    tempCategorySubTypeFilters.push(e.subCategoryType);
                }
            }
        })

        setTransactionTypeFilter([tempTransactionTypeFilters[0], ...tempTransactionTypeFilters.slice(1).sort()]);
        setCategoryFilter([tempCategoryFilters[0], ...tempCategoryFilters.slice(1).sort()]);
        setCategoryTypeFilter([tempCategoryTypeFilters[0], ...tempCategoryTypeFilters.slice(1).sort()]);
        setCategorySubTypeFilter([tempCategorySubTypeFilters[0], ...tempCategorySubTypeFilters.slice(1).sort()]);
    }, [dateSelection, transactions]);

    useEffect(() => {
        onChangeFilter(currentFilter);
    }, [currentFilter])

    function changeFilter(newFilter: string, filterType: string) {
        switch (filterType) {
            case 'transactionType':
                setCurrentFilter(prev => ({
                    ...prev,
                    transactionType: newFilter
                }));
                break;
            case 'transactionCategory':
                setCurrentFilter(prev => ({
                    ...prev,
                    transactionCategory: newFilter
                }));
                break;
            case 'categoryType':
                setCurrentFilter(prev => ({
                    ...prev,
                    categoryType: newFilter
                }));
                break;
            case 'subCategoryType':
                setCurrentFilter(prev => ({
                    ...prev,
                    subCategoryType: newFilter
                }));
                break;
        }
    }

    return (
        <div>
            <p>Filter by: </p>
            <select onChange={e => changeFilter(e.target.value, 'transactionType')}>
                {transactionTypeFilter.map((filter, index) => (
                    <option key={index} value={filter}>{filter}</option>
                ))}
            </select>
            <select onChange={e => changeFilter(e.target.value, 'transactionCategory')}>
                {categoryFilter.map((filter, index) => (
                    <option key={index} value={filter}>{filter}</option>
                ))}
            </select>
            <select onChange={e => changeFilter(e.target.value, 'categoryType')}>
                {categoryTypeFilter.map((filter, index) => (
                    <option key={index} value={filter}>{filter}</option>
                ))}
            </select>
            <select onChange={e => changeFilter(e.target.value, 'subCategoryType')}>
                {categorySubTypeFilter.map((filter, index) => (
                    <option key={index} value={filter}>{filter}</option>
                ))}
            </select>
        </div>
    )
}

export default FilterSelection;