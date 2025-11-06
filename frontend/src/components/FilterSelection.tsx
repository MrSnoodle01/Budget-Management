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

        transactions.forEach(e => {
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
        <div style={{ marginTop: "7.5vh" }}>
            <p style={{ marginBottom: 1 }}>Filter by: </p>
            <div className='input-group'>
                <label htmlFor='transactionTypeInput'>Transaction type</label>
                <select
                    id='transactionTypeInput'
                    onChange={e => changeFilter(e.target.value, 'transactionType')}
                >
                    {transactionTypeFilter.map((filter) => (
                        <option key={filter} value={filter}>{filter}</option>
                    ))}
                </select>
            </div>
            <div className='input-group'>
                <label htmlFor='transactionCategory'>Transaction Category</label>
                <select
                    id="transactionCategory"
                    onChange={e => changeFilter(e.target.value, 'transactionCategory')}
                >
                    {categoryFilter.map((filter) => (
                        <option key={filter} value={filter}>{filter}</option>
                    ))}
                </select>
            </div>
            <div className='input-group'>
                <label htmlFor='categoryType'>Category Type</label>
                <select
                    id='categoryType'
                    onChange={e => changeFilter(e.target.value, 'categoryType')}
                >
                    {categoryTypeFilter.map((filter) => (
                        <option key={filter} value={filter}>{filter}</option>
                    ))}
                </select>
            </div>
            <div className='input-group'>
                <label htmlFor='subCategoryType'>Category Sub-Type</label>
                <select
                    id='subCategoryType'
                    onChange={e => changeFilter(e.target.value, 'subCategoryType')}
                >
                    {categorySubTypeFilter.map((filter) => (
                        <option key={filter} value={filter}>{filter}</option>
                    ))}
                </select>
            </div>

        </div>
    )
}

export default FilterSelection;