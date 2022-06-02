import './App.scss';
import Results from './components/results/Results';
import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';

const regexWithSlash = new RegExp('[a-zA-Z]{3}\/[a-zA-Z]{3}');
const regex = new RegExp('[a-zA-Z]{3}[a-zA-Z]{3}');

function App() {
  const [searchInput, setSearchInput] = useState("");
  const [showInputError, setShowInputError] = useState(false);
  const navigate = useNavigate();
  let location = useLocation();
  let navigatingBySearch;

  const handleSubmit = (event) => {
    if (event.key === "Enter") {
      if (regexWithSlash.test(event.target.value)) {
        setShowInputError(false)
        let inputArr = event.target.value.split('/')
        setSearchInput(inputArr[0] + inputArr[1]);
      } else if (regex.test(event.target.value)) {
        setShowInputError(false)
        setSearchInput( event.target.value);
      } else {
        // Invalid input
        setShowInputError(true)
      }
    }
  };

  useEffect(() => {
    if (searchInput) {
      navigatingBySearch = true;
      navigate({
        pathname: '/' + searchInput,
      });
    }
  }, [searchInput]);

  useEffect(() => {
    if (!navigatingBySearch) {
      if (location.pathname !== searchInput && !location.pathname.includes('details')) {
        setSearchInput(location.pathname.substring(1));
      }
    }
    navigatingBySearch = false;
  }, [location]);

  return (
    <div className='main'>
      <div className="searchbar">
        <input type="text" placeholder="Search for pairs" onKeyDown={handleSubmit} />
        {showInputError &&
          <span>Invalid input</span>
        }
      </div>


      {searchInput &&
        <Routes>
          <Route path={"/" + searchInput + '/*'} element={<Results searchInput={searchInput} />} />
        </Routes>
      }
    </div>
  );
}

export default App;
