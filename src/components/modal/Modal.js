import './Modal.scss';
import { React, useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import { fetchAndUpdateDetails } from '../../api-helper'

function Modal({ setShowModal, item }) {
    const [showModalContent, setShowModalContent] = useState(false);
    const [modalContent, setModalContent] = useState();
    const navigate = useNavigate();
    let location = useLocation();

    const closeModal = () => {
        navigate(-1)
        setShowModal(false);
    }

    useEffect(() => {
        fetchAndUpdateDetails(item, setModalContent, setShowModalContent)
    }, []);

    useEffect(() => {
        if (!location.pathname.includes('details')) {
            setShowModal(false);
        }
    }, [location]);

    return showModalContent &&
        <div className='modal'>
            <button className='closeButton' onClick={closeModal}>X</button>
            <h3>{item.name} history</h3>
            <div className='details'>
                <div><b>Amount:</b></div>
                <div><b>Price:</b></div>
            </div>
            {modalContent && modalContent.map((item, index) => {
                return (
                    <div key={index} className='details'>
                        <div>{item.qty}</div>
                        <div>{item.price}</div>
                    </div>
                )
            })}
        </div>
}

export default Modal
