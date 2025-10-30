import ReactDOM from 'react-dom';
import MoneyInput from './MoneyInput'
import type { TransactionType } from '../types/transaction';

type EditModalProps = {
    isOpen: boolean;
    onClose: () => void;
    editedTransaction: TransactionType;
    onChangeTransaction: (option: TransactionType[]) => void;
    transactions: TransactionType[];
}

const EditModal: React.FC<EditModalProps> = ({ isOpen, onClose, editedTransaction, onChangeTransaction, transactions }) => {
    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div className='modal-content'>
            <MoneyInput isEditing={true} editedTransaction={editedTransaction} onChangeTransaction={onChangeTransaction} transactions={transactions} onClose={onClose} />
            <button onClick={onClose}>Cancel</button>
        </div>,
        document.body
    );
}

export default EditModal;