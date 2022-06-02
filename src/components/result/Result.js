import './Result.scss';
import { React, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Modal from '../modal/Modal';

function Result({ item, error }) {
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleItemClick = (event) => {
        if (!location.pathname.includes('details')) {
            let detailsPath = location.pathname + '/details';
            navigate(detailsPath);
            setShowModal(true);
        }
    }

    return (
        <>
            {error ?
                <div className='result'>
                    <div><b>{`${item.name}: `}</b></div>
                    <div className='errorMsg'>{item.errorMsg}</div>
                </div>
                :
                <div className='result' onClick={handleItemClick}>
                    <div><b>{`${item.name}:`}</b></div>
                    <div>{`1 ${item.symbol.substr(0, 3).toUpperCase()}`}</div>
                    <div>{item.price}</div>
                    <div>{item.symbol.substr(3, 5).toUpperCase()}</div>
                </div>
            }
            {
                showModal &&
                <Modal setShowModal={setShowModal} item={item} />
            }
        </>
    )
}

export default Result
