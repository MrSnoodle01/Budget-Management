import ReactDOM from 'react-dom';
import MoneyInput from './MoneyInput'

type TransactionType = {
    id: number;
    transactionType: string;
    transactionCategory?: string;
    categoryType?: string;
    subCategoryType?: string;
    amount: number;
    date: string;
}

export default function EditModal(props: { isOpen: boolean, onClose: () => void, editedTransaction: TransactionType, onChangeTransaction: (option: TransactionType[]) => void }) {
    if (!props.isOpen) return null;

    return ReactDOM.createPortal(
        <div className='modal-content'>
            <MoneyInput isEditing={true} editedTransaction={props.editedTransaction} onChangeTransaction={props.onChangeTransaction} />
            <button onClick={props.onClose}>Cancel</button>
        </div>,
        document.body
    );
}