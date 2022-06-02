import './Results.scss';
import { React, useState, useEffect } from 'react'
import Result from "../result/Result"
import { fetchAndUpdateResults } from '../../api-helper'

function Results({ searchInput }) {
    const [showResults, setShowResults] = useState(false);
    const [sortedBigFirst, setSortedBigFirst] = useState(false);
    const [finalData, setFinalData] = useState([]);

    const handleSortByPrice = () => {
        if (sortedBigFirst) {
            const sortedDataSmallFirst = [...finalData].sort((a, b) => a.price - b.price);
            setFinalData(sortedDataSmallFirst);
            setSortedBigFirst(false)
        } else {
            const sortedDataBigFirst = [...finalData].sort((a, b) => b.price - a.price);
            setFinalData(sortedDataBigFirst);
            setSortedBigFirst(true)
        }
    }

    useEffect(() => {
        setShowResults(false)
        fetchAndUpdateResults(searchInput, setFinalData, setShowResults)
    }, [searchInput]);

    return (
        <>
            <button onClick={handleSortByPrice}>
                Sort by price
            </button>
            <div className='results'>
                {showResults && finalData.map(dataObj => {
                    return <Result key={dataObj.id} item={dataObj} error={dataObj.errorMsg}/>
                })
                }
            </div>
        </>
    )
}

export default Results
